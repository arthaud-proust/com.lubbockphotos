import { Photo, PhotoSet } from '@/core/photo'
import { FlickrPhoto, FlickrPhotoSet } from './types'

export const toPhoto = (flickrPhoto: FlickrPhoto): Photo => {
  const photo: Photo = {
    id: flickrPhoto.id,
    title: flickrPhoto.title,
    small: {
      url: flickrPhoto.url_s,
      height: flickrPhoto.height_s,
      width: flickrPhoto.width_s,
    },
  }

  if (flickrPhoto.url_z) {
    photo.medium = {
      url: flickrPhoto.url_z,
      height: flickrPhoto.height_z,
      width: flickrPhoto.width_z,
    }
  }

  if (flickrPhoto.url_l) {
    photo.large = {
      url: flickrPhoto.url_l,
      height: flickrPhoto.height_l,
      width: flickrPhoto.width_l,
    }
  }

  if (flickrPhoto.url_k) {
    photo.huge = {
      url: flickrPhoto.url_k,
      height: flickrPhoto.height_k,
      width: flickrPhoto.width_k,
    }
  }

  return photo
}

export const toPhotoSet = (flickrPhotoSet: FlickrPhotoSet): PhotoSet => ({
  id: flickrPhotoSet.id,
  title: flickrPhotoSet.title._content,
  photos: [],
})
