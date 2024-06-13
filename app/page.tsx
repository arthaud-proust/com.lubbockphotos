import { PhotoGallery } from '@/PhotoGallery'
import { getAllPhotos } from '@/clients/flickr'
import 'photoswipe/dist/photoswipe.css'

export default async function Page() {
  const photos = await getAllPhotos()

  return (
    <>
      <header className='py-48 text-center md:py-40'>
        <h1 className='text-6xl md:text-9xl'>Lubbock</h1>
        <h2>Bordeaux</h2>
      </header>
      <PhotoGallery photos={photos} />
      <footer className='pt-40 pb-8 text-center'>
        <p>
          Created by{' '}
          <a href='https://arthaudproust.fr' className='underline'>
            Arthaud Proust
          </a>
        </p>
      </footer>
    </>
  )
}
