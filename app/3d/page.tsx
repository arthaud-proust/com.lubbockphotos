import { getPhotoSets } from '@/clients/flickr'
import { Gallery } from '@/components/canvas/Gallery'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 500 })

  console.log(photoSets)

  return (
    <>
      <Gallery photoSets={photoSets} />
    </>
  )
}
