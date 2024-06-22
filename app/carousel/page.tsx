import { getPhotoSets } from '@/clients/flickr/client'
import { Carousel } from '@/components/canvas/Carousel'

export default async function Page() {
  const photoSets = await getPhotoSets({ count: 20, countPerPhotoSet: 20 })

  return <Carousel photoSets={photoSets} />
}
