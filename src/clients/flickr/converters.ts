import { Photo, PhotoSet } from '@/core/types'
import { FlickrPhoto, FlickrPhotoSet } from './types'

export const toPhoto = (flickrPhoto: FlickrPhoto): Photo => ({
  id: flickrPhoto.id,
  title: flickrPhoto.title,
  small: {
    url: flickrPhoto.url_s,
    height: flickrPhoto.height_s,
    width: flickrPhoto.width_s,
  },
  medium: {
    url: flickrPhoto.url_z,
    height: flickrPhoto.height_z,
    width: flickrPhoto.width_z,
  },
  large: {
    url: flickrPhoto.url_l,
    height: flickrPhoto.height_l,
    width: flickrPhoto.width_l,
  },
})

export const toPhotoSet = (flickrPhotoSet: FlickrPhotoSet): PhotoSet => ({
  id: flickrPhotoSet.id,
  title: flickrPhotoSet.title._content,
  photos: [],
})
