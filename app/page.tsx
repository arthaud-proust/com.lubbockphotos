import { getPhotos } from '@/clients/flickr/client'
import { PhotoGallery } from '@/components/PhotoGallery'
import 'photoswipe/dist/photoswipe.css'

export default async function Page() {
  const photos = await getPhotos({ count: 500 })

  return (
    <>
      <header className='py-48 text-center md:py-40'>
        <h1 className='text-7xl md:text-9xl'>Lubbock</h1>
        <h2 className='mb-2 text-2xl md:text-3xl'>Bordeaux</h2>
      </header>
      <PhotoGallery photos={photos} />
      <footer className='pb-8 pt-40 text-center'>
        <p>
          <span>Created by </span>
          <a href='https://arthaudproust.fr' className='underline'>
            Arthaud Proust
          </a>
        </p>
      </footer>
    </>
  )
}
