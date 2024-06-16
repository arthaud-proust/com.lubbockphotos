import { getPhotoSets } from '@/clients/flickr/client'
import { Gallery } from '@/components/canvas/Gallery'
import Link from 'next/link'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 20, countPerPhotoSet: 20 })

  return (
    <>
      <h1 className='fixed left-8 top-8 z-50 flex flex-col p-4 text-sm'>
        <span className='ml-8'>Lubbock</span>
        <span>Bordeaux</span>
      </h1>
      <Link className='fixed right-8 top-8 z-50 p-4 text-sm decoration-2 underline-offset-2 hover:underline' href='/'>
        Accueil
      </Link>
      <Gallery photoSets={photoSets} />
    </>
  )
}
