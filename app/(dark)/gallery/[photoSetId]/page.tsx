import { getPhotoSetDetails, getPhotoSetReversedPhotos } from '@/clients/flickr/client'
import dynamic from 'next/dynamic'
const PhotoGallery = dynamic(() => import('@/components/PhotoGallery'), { ssr: false })

export default async function Page({ params }: { params: { photoSetId: string } }) {
  const photoSet = await getPhotoSetDetails({ photoSetId: params.photoSetId })
  photoSet.photos = await getPhotoSetReversedPhotos({
    photoSetId: params.photoSetId,
    photoSetPhotosCount: photoSet.photoCount,
  })

  return (
    <main className='relative grow space-y-20 pr-4  md:pr-8'>
      <div className='flex h-screen w-full items-center justify-center'>
        <h1 className='text-h1 font-display'>{photoSet.title}</h1>
      </div>
      <PhotoGallery photoSet={photoSet} />
    </main>
  )
}
