import { createFlickr } from 'flickr-sdk'

const { flickr } = createFlickr('97818967026878ef662304c74417044c')
const LUBBOCK_FLICKR_USER_ID = '130002917@N03'

type PhotoSize = {
  url: string
  height: number
  width: number
}

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
  url_m: string
  height_m: number
  width_m: number
  url_l: string
  height_l: number
  width_l: number
}

export type Photo = {
  id: string
  title: string
  thumbnail: PhotoSize
  large: PhotoSize
}

export const getAllPhotos = async (): Promise<Array<Photo>> => {
  const allFlickrPhotos = (
    await flickr('flickr.people.getPhotos', {
      user_id: LUBBOCK_FLICKR_USER_ID,
      content_types: '0',
      privacy_filter: '1',
      extras: 'url_m, url_l',
      per_page: '500',
    })
  ).photos.photo as Array<FlickrPhoto>

  return allFlickrPhotos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    thumbnail: {
      url: photo.url_m,
      height: photo.height_m,
      width: photo.width_m,
    },
    large: {
      url: photo.url_l,
      height: photo.height_l,
      width: photo.width_l,
    },
  }))
}
