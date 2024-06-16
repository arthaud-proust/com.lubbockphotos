import { Photo } from '@/core/photoScene'
import { createFlickr } from 'flickr-sdk'

const { flickr } = createFlickr('97818967026878ef662304c74417044c')
const LUBBOCK_FLICKR_USER_ID = '130002917@N03'

type FlickrPhoto = {
  id: string
  owner: string
  secret: string
  server: string
  farm: number
  title: string
  ispublic: boolean
  isfriend: boolean
  isfamily: boolean
  url_s: string
  height_s: number
  width_s: number
  url_z: string
  height_z: number
  width_z: number
  url_l: string
  height_l: number
  width_l: number
}

const toPhoto = (photo: FlickrPhoto) => ({
  id: photo.id,
  title: photo.title,
  small: {
    url: photo.url_s,
    height: photo.height_s,
    width: photo.width_s,
  },
  medium: {
    url: photo.url_z,
    height: photo.height_z,
    width: photo.width_z,
  },
  large: {
    url: photo.url_l,
    height: photo.height_l,
    width: photo.width_l,
  },
})

export const getPhotos = async ({ count = 500 }: { count: number }): Promise<Array<Photo>> => {
  const allFlickrPhotos = (
    await flickr('flickr.people.getPhotos', {
      user_id: LUBBOCK_FLICKR_USER_ID,
      content_types: '0',
      privacy_filter: '1',
      extras: 'url_s, url_z, url_l',
      per_page: `${count}`,
    })
  ).photos.photo as Array<FlickrPhoto>

  return allFlickrPhotos.map(toPhoto)
}
