'use client'
import { bestSizeAvailable, Photo, PhotoSet } from '@/core/photo'
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { MutableRefObject, useRef } from 'react'

function useImageScaling(value: MotionValue<number>) {
  return useTransform(value, [0, 0.5, 1], [0, 1, 0])
}

function useImageOpacity(value: MotionValue<number>) {
  return useTransform(value, [0, 0.5, 1], [0, 1, 0])
}

function SizeChangingPhoto({ container, photo }: { container: MutableRefObject<HTMLElement>; photo: Photo }) {
  const target = useRef(null)

  const { scrollYProgress } = useScroll({
    container,
    target,
    offset: ['end start', 'start end'],
  })
  const scale = useImageScaling(scrollYProgress)

  const photoSize = bestSizeAvailable(photo)

  return (
    <div ref={target} className='z-50  h-screen w-full'>
      <motion.div style={{ scale }}>
        <Image
          className='h-screen w-full object-contain object-center'
          alt=''
          src={photoSize.url}
          height={photoSize.height}
          width={photoSize.width}
        />
      </motion.div>
    </div>
  )
}

function OpacityChangingPhoto({ container, photo }: { container: MutableRefObject<HTMLElement>; photo: Photo }) {
  const target = useRef(null)

  const { scrollYProgress } = useScroll({
    container,
    target,
    offset: ['end start', 'start end'],
  })
  const opacity = useImageOpacity(scrollYProgress)

  const photoSize = bestSizeAvailable(photo)

  return (
    <div ref={target} className='relative h-screen w-full'>
      <div className='pointer-events-none absolute top-[-100vh] h-[300vh] w-full'>
        <div className='sticky top-0 h-0 w-full overflow-visible'>
          <motion.div style={{ opacity }}>
            <Image
              className='h-screen w-full object-contain object-center'
              alt=''
              src={photoSize.url}
              height={photoSize.height}
              width={photoSize.width}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function PhotoGallery({ photoSet }: { photoSet: PhotoSet }) {
  const container = useRef(document.getElementById('layout'))

  return (
    <div className='relative flex w-full flex-col'>
      {photoSet.photos.map((photo, index) =>
        index % 2 === 0 ? (
          <SizeChangingPhoto container={container} key={photo.id} photo={photo} />
        ) : (
          <OpacityChangingPhoto container={container} key={photo.id} photo={photo} />
        ),
      )}
    </div>
  )
}
