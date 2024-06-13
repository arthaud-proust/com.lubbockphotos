import { getAllPhotos } from '@/clients/flickr'
import Image from 'next/image'
export default async function Page() {
  const photos = await getAllPhotos()

  return (
    <>
      <header className='py-40 text-center'>
        <h1 className='text-9xl'>Lubbock</h1>
        <h2>Bordeaux</h2>
      </header>
      <main className='flex flex-wrap justify-center gap-4 p-4'>
        {photos.map((photo) => (
          <Image
            className='inline-block h-24 w-auto'
            key={photo.id}
            src={photo.thumbnail.url}
            height={photo.thumbnail.height}
            width={photo.thumbnail.width}
            alt=''
          />
        ))}
      </main>
    </>
  )
}
