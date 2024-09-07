export type PhotoSize = {
  url: string
  height: number
  width: number
}

export type Photo = {
  id: string
  title: string
  small: PhotoSize
  medium?: PhotoSize
  large?: PhotoSize
  huge?: PhotoSize
}

export type PhotoSet = {
  id: string
  title: string
  photoCount: number
  photos: Array<Photo>
}

export const bestSizeAvailable = (photo: Photo, maxSize: 'huge' | 'large' | 'medium' = 'huge'): PhotoSize => {
  if (maxSize === 'huge' && photo.huge) {
    return photo.huge
  }

  if ((maxSize === 'huge' || maxSize === 'large') && photo.large) {
    return photo.large
  }

  if ((maxSize === 'huge' || maxSize === 'large' || maxSize === 'medium') && photo.medium) {
    return photo.medium
  }

  return photo.small
}
