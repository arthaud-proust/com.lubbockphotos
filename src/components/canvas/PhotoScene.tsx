'use client'

import { PhotoScene } from '@/core/types'
import { useHelper } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THEE from 'three'

const Image3D = ({ url, ref }: { url: string; ref: any }) => {
  const texture = useMemo(() => new THEE.TextureLoader().load(url), [url])
  return (
    <mesh ref={ref}>
      <planeGeometry attach='geometry' args={[5, 4]} />
      <meshBasicMaterial side={THEE.DoubleSide} attach='material' map={texture} />
    </mesh>
  )
}

export const PhotoSceneComponent = ({ scene }: { scene: PhotoScene }) => {
  const position = new THEE.Vector3(scene.position.x, scene.position.y, scene.position.z)
  const rotation = new THEE.Euler(scene.rotation.x, scene.rotation.y, scene.rotation.z)

  const light = useRef()
  const image = useRef()

  useHelper(light, THEE.SpotLightHelper)
  return (
    <group position={position} rotation={rotation}>
      <Image3D url={scene.photo.small.url} ref={image} />
      <spotLight
        ref={light}
        position={[0, 4, -4]}
        target={image.current}
        angle={Math.PI / 10}
        intensity={3}
        decay={0.2}
      />
      <pointLight position={[-10, -10, -10]} color='blue' decay={0.2} />
    </group>
  )
}
