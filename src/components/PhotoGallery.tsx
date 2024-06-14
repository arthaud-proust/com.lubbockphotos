'use client'

import { Photo } from '@/clients/flickr'
import Image from 'next/image'
import 'photoswipe/dist/photoswipe.css'

import { Gallery, Item } from 'react-photoswipe-gallery'

export function PhotoGallery({ photos }: { photos: Array<Photo> }) {
  return (
    <main className='flex flex-wrap justify-center gap-2 p-2 md:gap-4 md:p-4'>
      <Gallery>
        {photos.map((photo) => (
          <Item
            key={photo.id}
            original={photo.large.url}
            height={photo.large.height}
            width={photo.large.width}
            thumbnail={photo.thumbnail.url}
          >
            {({ ref, open }) => (
              <Image
                className='inline-block h-12 w-auto md:h-24'
                alt=''
                ref={ref}
                onClick={open}
                src={photo.thumbnail.url}
                height={photo.thumbnail.height}
                width={photo.thumbnail.width}
              />
            )}
          </Item>
        ))}
      </Gallery>
    </main>
  )
}
