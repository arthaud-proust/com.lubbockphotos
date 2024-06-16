import { getPhotoSets } from '@/clients/flickr/client'
import { Gallery } from '@/components/canvas/Gallery'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 500 })

  return (
    <>
      <Gallery photoSets={photoSets} />
    </>
  )
}
