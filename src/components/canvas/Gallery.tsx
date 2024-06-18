'use client'
import { Photo, PhotoSet } from '@/core/types'
import {
  Billboard,
  BillboardProps,
  Image as DreiImage,
  Plane,
  ScrollControls,
  Text,
  useScroll,
} from '@react-three/drei'
import { Canvas, GroupProps, extend, useFrame } from '@react-three/fiber'
import { easing, geometry } from 'maath'
import { PropsWithChildren, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { suspend } from 'suspend-react'
import * as THREE from 'three'

extend(geometry)
const inter = import('@pmndrs/assets/fonts/inter_regular.woff') as any

type CarouselGroup = {
  photoSet: PhotoSet
  start: number
  len: number
}

export const Gallery = ({ photoSets }: { photoSets: Array<PhotoSet> }) => {
  const gapBetweenGroups = 2

  const groups = photoSets.reduce((groups: Array<{ start: number; len: number; end: number }>, set, index) => {
    const len = set.photos.length
    if (index === 0) {
      const start = gapBetweenGroups
      const end = start + len

      return [...groups, { start, len, end }]
    }

    const lastGroup = groups[index - 1]
    const start = lastGroup.end + gapBetweenGroups
    const end = start + len

    return [...groups, { start, len, end }]
  }, [])

  const total = groups[groups.length - 1].end
  const pointToRadian = (point: number) => (Math.PI * 2 * point) / total

  const startOfGroup = (index: number) => pointToRadian(groups[index].start)
  const lenOfGroup = (index: number) => pointToRadian(groups[index].len)

  const carouselGroups: Array<CarouselGroup> = photoSets.map((photoSet, index) => ({
    photoSet,
    start: startOfGroup(index),
    len: lenOfGroup(index),
  }))

  return (
    <Canvas className='!fixed left-0 top-0' dpr={[1, 1.5]}>
      <ScrollControls horizontal pages={6} infinite>
        <Scene position={[0, 1, -8]} carouselGroups={carouselGroups} />
      </ScrollControls>
    </Canvas>
  )
}

function Scene({
  children,
  carouselGroups,
  ...props
}: PropsWithChildren<{ carouselGroups: Array<CarouselGroup> } & GroupProps>) {
  const radius = 15

  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>()
  const scroll = useScroll()
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null)
  const raycaster = useMemo(
    () => new THREE.Raycaster(new THREE.Vector3(0, 1, radius * 0.25), new THREE.Vector3(0, 0, 1).normalize()),
    [],
  )

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 1.5 + 5, 11.5], 0.3, delta)
    state.camera.lookAt(0, 0, 0)

    setActivePhoto(hoveredPhoto ?? raycaster.intersectObject(ref.current)[0]?.object.userData.photo ?? null)
  })

  return (
    <group ref={ref} {...props}>
      {carouselGroups.map((carouselGroup) => (
        <Cards
          key={carouselGroup.photoSet.id}
          category={carouselGroup.photoSet.title}
          from={carouselGroup.start}
          len={carouselGroup.len}
          radius={radius}
          photos={carouselGroup.photoSet.photos}
          onHoverCard={(photo: Photo | null) => setHoveredPhoto(photo)}
        />
      ))}
      {activePhoto ? <ActiveCard photo={activePhoto} /> : null}
    </group>
  )
}

function Cards({
  photos,
  category,
  from,
  len,
  radius,
  onHoverCard,
  ...props
}: {
  photos: Array<Photo>
  category?: string
  from: number
  len: number
  radius: number
  onHoverCard: (index: Photo | null) => void
} & GroupProps) {
  const [hovered, hover] = useState(null)
  const amount = photos.length
  const anglePerPhoto = len / amount
  const textAngle = from + 0.5 * len
  const textDistance = 1.06

  return (
    <group {...props}>
      <Billboard
        position={[Math.sin(textAngle) * radius * textDistance, -0.5, Math.cos(textAngle) * radius * textDistance]}
      >
        <Text font={(suspend(inter) as any).light} fontSize={0.11} anchorX='center' color='black'>
          {category}
        </Text>
      </Billboard>

      {photos.map((photo, i) => {
        const angle = from + anglePerPhoto * i
        return (
          <Card
            key={angle}
            onPointerOver={(e: any) => (e.stopPropagation(), hover(i), onHoverCard(photo))}
            onPointerOut={() => (hover(null), onHoverCard(null))}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            photo={photo}
          />
        )
      })}
    </group>
  )
}

function Card({
  photo,
  active,
  hovered,
  ...props
}: {
  photo: Photo
  active: boolean
  hovered: boolean
} & GroupProps) {
  const ref = useRef<any>()

  const ratio = 1

  useFrame((_, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta)
    easing.damp3(ref.current.scale, [ratio * f, 1 * f, 1], 0.15, delta)
  })

  return (
    <group {...props}>
      <DreiImage
        userData={{ photo }}
        ref={ref}
        transparent
        rotation={[0, Math.PI / 4, 0]}
        url={photo.small.url}
        scale={[ratio, 1]}
        side={THREE.DoubleSide}
      />
    </group>
  )
}

function LoadingImage({ size, position }: { size: [number, number]; position: [number, number, number] }) {
  return <Plane args={size} position={position} />
}

function ActiveCard({ photo, ...props }: { photo: Photo | undefined } & BillboardProps) {
  const ref = useRef<any>()

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.material.zoom = 0.9
    }
  }, [photo])
  useFrame((_, delta) => {
    if (!ref.current) {
      return
    }
    easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
    easing.damp(ref.current.material, 'opacity', !!photo ? 1 : 0, delta)
  })

  const size = 15,
    scale: [number, number] = [size, size],
    position: [number, number, number] = [0, 0, 0]

  return (
    photo && (
      <Billboard {...props}>
        <Text
          font={(suspend(inter) as any).default}
          fontSize={0.5}
          position={[size / 2 + position[0] + 1, size / 2 + position[1] - 1, 0]}
          anchorX='left'
          color='black'
        >
          {photo.title}
        </Text>
        <Suspense
          fallback={
            <Suspense fallback={<LoadingImage size={scale} position={position} />}>
              <DreiImage ref={ref} transparent position={position} scale={scale} url={photo.small.url} />
            </Suspense>
          }
        >
          <DreiImage ref={ref} transparent position={position} scale={scale} url={photo.medium.url} />
        </Suspense>
      </Billboard>
    )
  )
}
