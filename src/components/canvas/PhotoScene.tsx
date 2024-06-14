'use client'

import { PhotoScene } from '@/core/photoScene'
import { useMemo } from 'react'
import { Euler, TextureLoader, Vector3, DoubleSide } from 'three'

const Texture = ({ texture }) => {
  return (
    <mesh>
      <planeGeometry attach='geometry' args={[5, 4]} />
      <meshBasicMaterial side={DoubleSide} attach='material' map={texture} />
    </mesh>
  )
}
const Image3D = ({ url }: { url: string }) => {
  const texture = useMemo(() => new TextureLoader().load(url), [url])
  return <Texture texture={texture} />
}

export const PhotoSceneComponent = ({ scene }: { scene: PhotoScene }) => {
  const position = new Vector3(scene.position.x, scene.position.y, scene.position.z)
  const rotation = new Euler(scene.rotation.x, scene.rotation.y, scene.rotation.z)

  return (
    <group position={position} rotation={rotation}>
      <Image3D url={scene.photo.thumbnail.url} />
      <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
      <pointLight position={[-10, -10, -10]} color='blue' decay={0.2} />
    </group>
  )
}
