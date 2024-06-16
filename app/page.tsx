import { getPhotos } from '@/clients/flickr/client'
import { PhotoGallery } from '@/components/PhotoGallery'
import Link from 'next/link'
import 'photoswipe/dist/photoswipe.css'

export default async function Page() {
  const photos = await getPhotos({ count: 500 })

  return (
    <>
      <div className='pointer-events-none fixed right-0 top-0 z-50 p-8'>
        <Link className='pointer-events-auto p-2 decoration-2 underline-offset-2 hover:underline' href='/carousel'>
          Carousel
        </Link>
      </div>
      <header className='py-48 text-center md:py-40'>
        <h1 className='text-7xl md:text-9xl'>Lubbock</h1>
        <h2 className='mb-2 text-2xl md:text-3xl'>Bordeaux</h2>
      </header>
      <PhotoGallery photos={photos} />
      <footer className='pb-8 pt-40 text-center'>
        <p>
          <span className='text-gray-400'>Website created by </span>
          <a href='https://arthaudproust.fr' className='text-gray-500 underline'>
            Arthaud Proust
          </a>
        </p>
      </footer>
    </>
  )
}
