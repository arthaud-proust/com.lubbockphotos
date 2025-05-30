'use client'
import tick from '@/audio/tick.mp3'
import { bestSizeAvailable, Photo, PhotoSet } from '@/core/photo'
import {
  Billboard,
  BillboardProps,
  Image as DreiImage,
  Plane,
  ScrollControls,
  Text,
  useScroll,
} from '@react-three/drei'
import { Canvas, extend, GroupProps, useFrame } from '@react-three/fiber'
import { easing, geometry } from 'maath'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useSound from 'use-sound'

extend(geometry)
const geomanistRegularUrl = '/fonts/geomanist/Geomanist-Regular.woff'

type CarouselGroup = {
  photoSet: PhotoSet
  start: number
  len: number
}

type PhotoSetInfos = Omit<PhotoSet, 'photos'>

type Slot = {
  angle: number
  photo?: Photo
  photoSetInfos?: PhotoSetInfos
}

export const Carousel = ({ photoSets }: { photoSets: Array<PhotoSet> }) => {
  const photoCount = photoSets.reduce((total, photoSet) => total + photoSet.photos.length, 0)
  const gapCount = photoSets.length // one gap before each photoSet
  const slotCount = photoCount + gapCount
  const baseAngle = (Math.PI * 2) / slotCount

  const slots = [] as Array<Slot>
  photoSets.forEach((photoSet) => {
    photoSet.photos.forEach((photo) => {
      slots.push({ angle: baseAngle * slots.length, photo })
    })

    slots.push({
      angle: baseAngle * (slots.length - 2 - photoSet.photos.length / 2),
      photoSetInfos: {
        id: photoSet.id,
        title: photoSet.title,
        photoCount: photoSet.photos.length,
      },
    })
  })

  return (
    <Canvas className='!fixed left-0 top-0' dpr={[1, 1.5]}>
      <ScrollControls horizontal pages={6} infinite>
        <Scene slots={slots} baseAngle={baseAngle} position={[0, 1, -8]} />
      </ScrollControls>
    </Canvas>
  )
}

function Scene({ slots, baseAngle, ...props }: { slots: Array<Slot>; baseAngle: number } & GroupProps) {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>()
  const [isBigDisplay, setIsBigDisplay] = useState(false)
  const toggleBigDisplay = () => setIsBigDisplay(!isBigDisplay)

  const radius = 15
  const textDistance = 1.06

  const [activeSlotIndex, setActiveSlotIndex] = useState<number | undefined>(0)
  const activePhoto = (activeSlotIndex && slots[activeSlotIndex]?.photo) || undefined

  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | undefined>(undefined)
  const hoveredPhoto = (hoveredSlotIndex && slots[hoveredSlotIndex]?.photo) || undefined

  const scroll = useScroll()

  const [playTick] = useSound(tick)

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y = Math.PI * 2 * (1 - scroll.offset) // Rotate contents

    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [state.pointer.x * 2, state.pointer.y * 1.5 + 5.5, 11.5], 0.3, delta)
    state.camera.lookAt(0, 1, 0)

    // get photo by rotation.y
    const slotIndex = Math.round(ref.current.rotation.y / baseAngle)

    const photo = slots[slotIndex]?.photo
    const newActiveSlotIndex = photo ? slotIndex : hoveredSlotIndex

    if (newActiveSlotIndex && newActiveSlotIndex !== activeSlotIndex) {
      setActiveSlotIndex(newActiveSlotIndex)
    }
  })

  useEffect(() => {
    playTick()
  }, [activeSlotIndex, playTick])

  return (
    <group {...props} ref={ref} position={[0, 1, -8]}>
      {slots.map(({ angle, photo, photoSetInfos }, index) => {
        if (photoSetInfos) {
          return (
            <Billboard
              key={photoSetInfos.id}
              position={[Math.sin(-angle) * radius * textDistance, -0.5, Math.cos(-angle) * radius * textDistance]}
            >
              <Text font={geomanistRegularUrl} fontSize={0.13} anchorX='center' color='black'>
                {photoSetInfos.title} ({photoSetInfos.photoCount})
              </Text>
            </Billboard>
          )
        } else {
          return (
            <Card
              key={photo.id}
              onPointerOver={(e: any) => (e.stopPropagation(), setHoveredSlotIndex(index))}
              onPointerOut={() => setHoveredSlotIndex(undefined)}
              position={[Math.sin(-angle) * radius, 0, Math.cos(-angle) * radius]}
              rotation={[0, Math.PI / 2 - angle, 0]}
              active={activeSlotIndex === index}
              hovered={hoveredSlotIndex === index}
              isActiveHovered={false}
              photo={photo}
            />
          )
        }
      })}
      <ActiveCard photo={activePhoto} isHovered={isBigDisplay} onClick={toggleBigDisplay} />
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

  const photoSize = bestSizeAvailable(photo, 'large')

  return (
    <>
      <Text
        font={geomanistRegularUrl}
        fontSize={0.5}
        position={[scale[0] / 2 + position[0] + 1, scale[1] / 2 + position[1] - 1, 0]}
        anchorX='left'
        color='black'
      >
        {photo.title}
      </Text>
      <Suspense
        fallback={
          <Suspense fallback={<LoadingImage size={scale} position={position} />}>
            <DreiImage transparent position={position} scale={scale} url={photo.small.url} />
          </Suspense>
        }
      >
        <DreiImage ref={ref} transparent position={position} scale={scale} url={photoSize.url} />
      </Suspense>
    </>
  )
}
