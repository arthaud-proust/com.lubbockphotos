import { getPhotoSets } from '@/clients/flickr/client'
import Image from 'next/image'
import Link from 'next/link'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 500, countPerPhotoSet: 3 })

  return (
    <main className='grid grid-cols-1 items-end gap-8 py-[30vh] pr-4 sm:grid-cols-3 md:grid-cols-3 md:pr-8 lg:grid-cols-4 xl:grid-cols-6'>
      {photoSets.map((photoSet) => (
        <div key={photoSet.id} className='relative flex-1'>
          <Image
            className='aspect-square w-full object-cover'
            src={photoSet.photos[0].small.url}
            width={photoSet.photos[0].small.width}
            height={photoSet.photos[0].small.height}
            alt=''
          />
          <Link
            href={`/gallery/${photoSet.id}`}
            className='group mt-2 block w-full truncate text-center before:absolute before:inset-0'
          >
            <span className='link'>{photoSet.title}</span>
          </Link>
        </div>
      ))}
    </main>
  )
}
