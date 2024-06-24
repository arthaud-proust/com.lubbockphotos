import { getPhotoSets } from '@/clients/flickr/client'
import Image from 'next/image'
import Link from 'next/link'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 500, countPerPhotoSet: 3 })

  return (
    <main className='grid grid-cols-1 items-end gap-4 py-[30vh] pr-4 sm:grid-cols-3 md:grid-cols-4 md:pr-8 lg:grid-cols-6 xl:grid-cols-10'>
      {photoSets.map((photoSet) => (
        <div key={photoSet.id} className='relative flex-1'>
          <Image
            className='aspect-square w-full object-cover'
            src={photoSet.photos[0].small.url}
            width={photoSet.photos[0].small.width}
            height={photoSet.photos[0].small.height}
            alt=''
          />
          <Link href={`/gallery/${photoSet.id}`} className='block w-full truncate after:absolute after:inset-0'>
            {photoSet.title}
          </Link>
        </div>
      ))}
    </main>
  )
}
