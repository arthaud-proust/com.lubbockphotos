import { getPhotos } from '@/clients/flickr/client'
import { PhotoGallery } from '@/components/PhotoGallery'
import Link from 'next/link'
import 'photoswipe/dist/photoswipe.css'

export default async function Page() {
  const photos = await getPhotos({ count: 500 })

  return (
    <>
      <div className='flex min-h-screen items-start gap-4 px-4 pt-8 md:gap-8 md:px-8'>
        <div className='sticky top-8 w-20 shrink-0 text-sm'>
          <Link className='flex items-center gap-2 underline-offset-2 hover:underline' href='/'>
            Lubbock
          </Link>
          <Link className='flex items-center gap-2 underline-offset-2 hover:underline' href='/carousel'>
            Carousel
          </Link>
          <h1 className='flex items-center gap-2'>
            <span className='block h-px w-full bg-black'></span>
            Grid
          </h1>
        </div>

        <main className='space-y-20 py-[30vh] pr-4 md:pr-8'>
          <PhotoGallery photos={photos} />
        </main>
      </div>
    </>
  )
}
