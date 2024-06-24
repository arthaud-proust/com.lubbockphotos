'use client'
import tick from '@/audio/tick.mp3'
import { Photo, PhotoSet } from '@/core/types'
import { useThrottled } from '@/helpers/throttle'
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
import useSound from 'use-sound'

extend(geometry)
const inter = import('@pmndrs/assets/fonts/inter_regular.woff') as any

type CarouselGroup = {
  photoSet: PhotoSet
  start: number
  len: number
}

export const Carousel = ({ photoSets }: { photoSets: Array<PhotoSet> }) => {
  const gapBetweenGroups = 1

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
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>()
  const [isBigDisplay, setIsBigDisplay] = useState(false)

  const radius = 15

  const scroll = useScroll()
  const [activePhoto, setActivePhoto] = useState<Photo | null>(carouselGroups[0].photoSet.photos[0])
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null)
  const raycaster = useMemo(
    () => new THREE.Raycaster(new THREE.Vector3(0, 1, radius * 0.25), new THREE.Vector3(0, 0, 1).normalize()),
    [radius],
  )
  const [playTick] = useSound(tick)
  const playTickThrottled = useThrottled(playTick, 50)

  const switchDisplay = () => setIsBigDisplay(!isBigDisplay)

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 1.5 + 5.5, 11.5], 0.3, delta)
    state.camera.lookAt(0, 1, 0)

    const newActivePhoto = hoveredPhoto ?? raycaster.intersectObject(ref.current)[0]?.object.userData.photo ?? null
    if (newActivePhoto && newActivePhoto.id !== activePhoto?.id) {
      setActivePhoto(newActivePhoto)
      playTickThrottled()
    }
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
          isActiveHovered={isBigDisplay}
          onHoverCard={(photo: Photo | null) => setHoveredPhoto(photo)}
        />
      ))}
      <ActiveCard photo={activePhoto} isHovered={isBigDisplay} onClick={switchDisplay} />
    </group>
  )
}

function Cards({
  photos,
  category,
  from,
  len,
  radius,
  isActiveHovered,
  onHoverCard,
  ...props
}: {
  photos: Array<Photo>
  category?: string
  from: number
  len: number
  radius: number
  isActiveHovered: boolean
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
        <Text font={(suspend(inter) as any).light} fontSize={0.13} anchorX='center' color='black'>
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
            isActiveHovered={isActiveHovered}
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
  isActiveHovered,
  ...props
}: {
  photo: Photo
  active: boolean
  hovered: boolean
  isActiveHovered: boolean
} & GroupProps) {
  const ref = useRef<THREE.Mesh>()

  const ratio = 1

  useFrame((_, delta) => {
    const activeHoveredYFactor = isActiveHovered ? 0.5 : 1
    const y = activeHoveredYFactor * (hovered ? 0.25 : 0)
    easing.damp3(ref.current.position, [0, y, 0], 0.1, delta)

    const scale = isActiveHovered ? 0.5 : hovered ? 1.4 : active ? 1.25 : 1
    easing.damp3(ref.current.scale, [ratio * scale, scale, 1], 0.15, delta)
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

function ActiveCard({
  photo,
  isHovered,
  onClick,
  ...props
}: {
  photo: Photo | undefined
  isHovered: boolean
  onClick: () => void
} & BillboardProps) {
  return (
    <Billboard {...props} onClick={onClick}>
      {photo && <ActiveCardImage photo={photo} isHovered={isHovered}></ActiveCardImage>}
    </Billboard>
  )
}

function ActiveCardImage({ photo, isHovered }: { photo: Photo | undefined; isHovered: boolean }) {
  const ref = useRef<any>()

  const squaredBase = 15
  const squaredScale: [number, number] = [squaredBase, squaredBase]

  const originalBase = 18
  const scaledWidth = (originalBase * photo.large.width) / photo.large.height
  const boundedWidth = Math.min(28, scaledWidth)
  const originalScale: [number, number] = [boundedWidth, originalBase]

  const scale = isHovered ? originalScale : squaredScale
  const position: [number, number, number] = [0, 0, 0]

  useLayoutEffect(() => {
    if (ref.current && !isHovered) {
      ref.current.material.zoom = 0.9
    }
  }, [photo, isHovered])
  useFrame((_, delta) => {
    if (!ref.current) {
      return
    }

    easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
    easing.damp(ref.current.material, 'opacity', photo ? 1 : 0, delta)
  })

  return (
    <>
      <Text
        font={(suspend(inter) as any).default}
        fontSize={0.5}
        position={[scale[0] / 2 + position[0] + 1, scale[1] / 2 + position[1] - 1, 0]}
        anchorX='left'
        color='black'
      >
        {photo.title}
      </Text>
      <Suspense
        fallback={
          <Suspense
            fallback={
              <Suspense fallback={<LoadingImage size={scale} position={position} />}>
                <DreiImage transparent position={position} scale={scale} url={photo.small.url} />
              </Suspense>
            }
          >
            <DreiImage ref={ref} transparent position={position} scale={scale} url={photo.medium.url} />
          </Suspense>
        }
      >
        <DreiImage ref={ref} transparent position={position} scale={scale} url={photo.large.url} />
      </Suspense>
    </>
  )
}
