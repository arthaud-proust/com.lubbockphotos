'use client'
import { PhotoScene } from '@/core/photoScene'
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
import { PropsWithChildren, Suspense, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'

extend(geometry)

export const Gallery = ({ photoScenes }: { photoScenes: Array<PhotoScene> }) => (
  <Canvas dpr={[1, 1.5]}>
    <ScrollControls pages={4} infinite>
      <Scene position={[0, 1.5, -2]} photoScenes={photoScenes} />
    </ScrollControls>
  </Canvas>
)

function Scene({ children, photoScenes, ...props }: PropsWithChildren<any>) {
  const ref = useRef<any>()
  const scroll = useScroll()
  const [hoveredSceneIndex, hoverSceneIndex] = useState<number | null>(null)

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, 10, 11], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={ref} {...props}>
      <Cards
        category='spring'
        from={0}
        len={Math.PI * 2}
        radius={9}
        photoScenes={photoScenes}
        onHoverCard={(index: number | null) => hoverSceneIndex(index)}
      />
      {hoveredSceneIndex ? <ActiveCard scene={photoScenes[hoveredSceneIndex]} /> : null}
    </group>
  )
}

function Cards({
  photoScenes,
  category,
  from = 0,
  len = Math.PI * 2,
  radius = 5.25,
  onHoverCard,
  ...props
}: {
  photoScenes: Array<PhotoScene>
  category?: string
  from?: number
  len?: number
  radius?: number
  onHoverCard: (index: number | null) => void
} & GroupProps) {
  const [hovered, hover] = useState(null)
  const amount = photoScenes.length
  const textPosition = from + (amount / 2 / amount) * len

  return (
    <group {...props}>
      {/* <Billboard position={[Math.sin(textPosition) * radius * 1.4, 0.5, Math.cos(textPosition) * radius * 1.4]}>
        <Text fontSize={0.25} anchorX='center' color='black'>
          {category}
        </Text>
      </Billboard> */}

      {Array.from({ length: amount }, (_, i) => {
        const angle = from + (i / amount) * len
        return (
          <Card
            key={angle}
            onPointerOver={(e: any) => (e.stopPropagation(), hover(i), onHoverCard(i))}
            onPointerOut={() => (hover(null), onHoverCard(null))}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            scene={photoScenes[i]}
          />
        )
      })}
    </group>
  )
}

function Card({
  scene,
  active,
  hovered,
  ...props
}: {
  scene: PhotoScene
  active: boolean
  hovered: boolean
} & GroupProps) {
  const ref = useRef<any>()

  const ratio = 1.618

  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta)
    easing.damp3(ref.current.scale, [ratio * f, 1 * f, 1], 0.15, delta)
  })

  return (
    <group {...props}>
      <DreiImage
        ref={ref}
        transparent
        radius={0.075}
        rotation={[Math.PI / 8, 0, 0]}
        url={scene.photo.small.url}
        scale={[ratio, 1]}
        side={THREE.DoubleSide}
      />
    </group>
  )
}

function LoadingImage({ size, position }: { size: [number, number]; position: [number, number, number] }) {
  return <Plane args={size} position={position} />
}

function ActiveCard({ scene, ...props }: { scene: PhotoScene | undefined } & BillboardProps) {
  const ref = useRef<any>()

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.material.zoom = 0.95
    }
  }, [scene])
  useFrame((state, delta) => {
    if (!ref.current) {
      return
    }
    easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
    easing.damp(ref.current.material, 'opacity', scene ? 1 : 0, 0.3, delta)
  })

  const size = 9,
    scale: [number, number] = [9, 9],
    position: [number, number, number] = [0, 1, 0]

  return (
    scene && (
      <Billboard {...props}>
        <Text fontSize={0.5} position={[0, -size / 2 + 0.5, 0]} anchorX='center' color='black'>
          {scene.photo.title}
        </Text>
        <Suspense fallback={<LoadingImage size={scale} position={position} />}>
          <DreiImage ref={ref} transparent radius={0.3} position={position} scale={scale} url={scene.photo.large.url} />
        </Suspense>
      </Billboard>
    )
  )
}
