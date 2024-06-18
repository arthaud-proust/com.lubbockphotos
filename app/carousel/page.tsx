import { getPhotoSets } from '@/clients/flickr/client'
import { Gallery } from '@/components/canvas/Gallery'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 20, countPerPhotoSet: 20 })

  return <Gallery photoSets={photoSets} />
}
