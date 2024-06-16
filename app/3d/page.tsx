import { getPhotos } from '@/clients/flickr'
import { Gallery } from '@/components/canvas/Gallery'
import { makePhotoScenes } from '@/core/photoScene'

export default async function Page() {
  const photos = await getPhotos({ count: 100 })

  const photoScenes = makePhotoScenes(photos)

  return (
    <>
      <Gallery photoScenes={photoScenes} />
    </>
  )
}
