import { getPhotos } from '@/clients/flickr/client'
import { PhotoGrid } from '@/components/PhotoGrid'
import 'photoswipe/dist/photoswipe.css'

export default async function Page() {
  const photos = await getPhotos({ count: 500 })

  return (
    <main className='space-y-20 py-[30vh] pr-4 md:pr-8'>
      <PhotoGrid photos={photos} />
    </main>
  )
}
