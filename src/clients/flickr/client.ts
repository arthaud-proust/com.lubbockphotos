import { Photo, PhotoSet } from '@/core/photo'
import { nextDivisor } from '@/helpers/maths'
import { createFlickr, FetchTransport } from 'flickr-sdk'
import { toPhoto, toPhotoSet } from './converters'
import { FlickrPhoto, FlickrPhotoSet } from './types'

const ONE_DAY = 24 * 3600
const transport = new FetchTransport({
  next: {
    revalidate: ONE_DAY,
  },
})
const { flickr } = createFlickr(process.env.FLICKR_API_KEY, transport)
const PHOTOS_EXTRAS = 'url_s, url_z, url_l, url_k'

const getPhotos = async ({ count = 500 }: { count?: number }): Promise<Array<Photo>> => {
  const flickrPhotos = (
    await flickr('flickr.people.getPhotos', {
      user_id: process.env.FLICKR_USER_ID,
      content_types: '0',
      privacy_filter: '1',
      extras: PHOTOS_EXTRAS,
      per_page: `${count}`,
    })
  ).photos.photo as Array<FlickrPhoto>

  return flickrPhotos.map(toPhoto).reverse()
}

const getPhotoSetPhotos = async ({
  photoSetId,
  count = 500,
}: {
  photoSetId: string
  count?: number
}): Promise<Array<Photo>> => {
  const flickrPhotos = (
    await flickr('flickr.photosets.getPhotos', {
      user_id: process.env.FLICKR_USER_ID,
      photoset_id: photoSetId,
      privacy_filter: '1',
      extras: PHOTOS_EXTRAS,
      per_page: `${count}`,
      media: 'photos',
    })
  ).photoset.photo as Array<FlickrPhoto>

  return flickrPhotos.map(toPhoto)
}

/**
 * Flickr API doesn't give orderby params, so we need the photoSetPhotosCount to compute the last page
 */
const getPhotoSetReversedPhotos = async ({
  photoSetId,
  photoSetPhotosCount,
  count = 500,
}: {
  photoSetId: string
  photoSetPhotosCount: number
  count?: number
}): Promise<Array<Photo>> => {
  const wantedCount = Math.min(count, photoSetPhotosCount)
  const perPage = nextDivisor(photoSetPhotosCount, wantedCount)
  const lastPage = photoSetPhotosCount / perPage

  const flickrPhotos = (
    await flickr('flickr.photosets.getPhotos', {
      user_id: process.env.FLICKR_USER_ID,
      photoset_id: photoSetId,
      privacy_filter: '1',
      extras: PHOTOS_EXTRAS,
      page: lastPage.toString(),
      per_page: `${perPage}`,
      media: 'photos',
    })
  ).photoset.photo as Array<FlickrPhoto>

  // We may get little more photo (caused by nextDivisor), so we slice to get the right count
  return flickrPhotos.map(toPhoto).reverse().slice(0, wantedCount)
}

const getPhotoSetDetails = async ({ photoSetId }: { photoSetId: string }): Promise<PhotoSet> => {
  const flickrPhotoset = (
    await flickr('flickr.photosets.getInfo', {
      user_id: process.env.FLICKR_USER_ID,
      photoset_id: photoSetId,
    })
  ).photoset as FlickrPhotoSet

  return toPhotoSet(flickrPhotoset)
}

const getPhotoSets = async ({
  count = 20,
  countPerPhotoSet = 10,
  minPhotosPerPhotoset,
}: {
  count?: number
  countPerPhotoSet?: number
  minPhotosPerPhotoset?: number
}): Promise<Array<PhotoSet>> => {
  minPhotosPerPhotoset ??= Math.min(countPerPhotoSet, 3)

  const flickrGalleries = (
    await flickr('flickr.photosets.getList', {
      user_id: process.env.FLICKR_USER_ID,
      per_page: `${count}`,
    })
  ).photosets.photoset as Array<FlickrPhotoSet>

  const photoSets = flickrGalleries.map(toPhotoSet)

  const fetchPhotoSetPhotoTasks = photoSets.map(
    async (photoSet) =>
      (photoSet.photos = await getPhotoSetReversedPhotos({
        photoSetId: photoSet.id,
        count: countPerPhotoSet,
        photoSetPhotosCount: photoSet.photoCount,
      })),
  )
  await Promise.all(fetchPhotoSetPhotoTasks)

  return photoSets.filter((photoSet) => photoSet.photos.length >= minPhotosPerPhotoset)
}

export { getPhotos, getPhotoSetDetails, getPhotoSetPhotos, getPhotoSetReversedPhotos, getPhotoSets }
