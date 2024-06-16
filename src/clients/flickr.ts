import { Photo, PhotoSet } from '@/core/types'
import { createFlickr } from 'flickr-sdk'
import { toPhoto, toPhotoSet } from './converters'
import { FlickrPhoto, FlickrPhotoSet } from './types'

const { flickr } = createFlickr('97818967026878ef662304c74417044c')

export const getPhotos = async ({ count = 500 }: { count: number }): Promise<Array<Photo>> => {
  const flickrPhotos = (
    await flickr('flickr.people.getPhotos', {
      user_id: process.env.FLICKR_USER_ID,
      content_types: '0',
      privacy_filter: '1',
      extras: 'url_s, url_z, url_l',
      per_page: `${count}`,
    })
  ).photos.photo as Array<FlickrPhoto>

  return flickrPhotos.map(toPhoto)
}

export const getPhotoSetPhotos = async ({
  photoSetId,
  count = 500,
}: {
  photoSetId: string
  count: number
}): Promise<Array<Photo>> => {
  const flickrPhotos = (
    await flickr('flickr.photosets.getPhotos', {
      user_id: process.env.FLICKR_USER_ID,
      photoset_id: photoSetId,
      privacy_filter: '1',
      extras: 'url_s, url_z, url_l',
      per_page: `${count}`,
      media: 'photos',
    })
  ).photoset.photo as Array<FlickrPhoto>

  return flickrPhotos.map(toPhoto)
}

export const getPhotoSets = async ({ count = 500 }: { count: number }): Promise<Array<PhotoSet>> => {
  const flickrGalleries = (
    await flickr('flickr.photosets.getList', {
      user_id: process.env.FLICKR_USER_ID,
      per_page: `${count}`,
    })
  ).photosets.photoset as Array<FlickrPhotoSet>

  const photoSets = flickrGalleries.map(toPhotoSet)

  const fetchPhotoSetPhotoTasks = photoSets.map(
    async (photoSet) => (photoSet.photos = await getPhotoSetPhotos({ photoSetId: photoSet.id, count: 10 })),
  )
  await Promise.all(fetchPhotoSetPhotoTasks)

  return photoSets.filter((photoSet) => photoSet.photos.length >= 3)
}
