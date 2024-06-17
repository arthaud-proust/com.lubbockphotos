import { getPhotoSets } from '@/clients/flickr/client'
import { Gallery } from '@/components/canvas/Gallery'
import Link from 'next/link'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 20, countPerPhotoSet: 20 })

  return (
    <>
      <div className='fixed left-4 top-8 z-50 w-20 text-sm md:left-8'>
        <Link className='flex items-center gap-2 underline-offset-2 hover:underline' href='/'>
          Lubbock
        </Link>
        <h1 className='flex items-center gap-2'>
          <span className='block h-px w-full bg-black'></span>
          Carousel
        </h1>
        <Link className='flex items-center gap-2 underline-offset-2 hover:underline' href='/grid'>
          Grid
        </Link>
      </div>
      <Gallery photoSets={photoSets} />
    </>
  )
}
