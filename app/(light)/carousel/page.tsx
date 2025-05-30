import { getPhotoSets } from '@/clients/flickr/client'
import { Carousel } from '@/components/canvas/Carousel'

export default async function Page() {
  let photoSets = await getPhotoSets({ count: 20, countPerPhotoSet: 20 })

  const existingPhotoIds = new Set<string>()

  // Filter out photos that already exist in a photo set
  photoSets.forEach((photoSet) => {
    photoSet.photos = photoSet.photos.filter((photo) => {
      if (existingPhotoIds.has(photo.id)) {
        return false
      }
      // Deduplicate photos
      existingPhotoIds.add(photo.id)
      return true
    })
  })

  // Filter out empty photo sets
  photoSets = photoSets.filter((photoSet) => photoSet.photos.length > 0)

  return <Carousel photoSets={photoSets} />
}
