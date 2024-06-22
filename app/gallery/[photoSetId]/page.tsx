import { getPhotoSetDetails, getPhotoSetPhotos } from '@/clients/flickr/client'
import { PhotoGallery } from '@/components/PhotoGallery'

export default async function Page({ params }: { params: { photoSetId: string } }) {
  const photoSet = await getPhotoSetDetails({ photoSetId: params.photoSetId })
  const photos = await getPhotoSetPhotos({ count: 500, photoSetId: params.photoSetId })

  return (
    <main className='space-y-20 py-[30vh] pr-4 md:pr-8'>
      <h1 className='text-h1'>{photoSet.title}</h1>
      <PhotoGallery photos={photos} />
    </main>
  )
}
