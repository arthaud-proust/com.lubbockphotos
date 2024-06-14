export type PhotoSize = {
  url: string
  height: number
  width: number
}

export type Photo = {
  id: string
  title: string
  thumbnail: PhotoSize
  large: PhotoSize
}

export type Vector3 = {
  x: number
  y: number
  z: number
}

export type PhotoSceneSize = {
  height: number
  width: number
  depth: number
}

export type PhotoScene = {
  photo: Photo
  position: Vector3
  rotation: Vector3
  size: PhotoSceneSize
}

export const photoSceneSize = (photo: Photo): PhotoSceneSize => {
  return {
    height: photo.large.height,
    width: photo.large.width,
    depth: 10,
  }
}

export const photoScene = (photo: Photo, index: number): PhotoScene => {
  const distance = 20
  const angle = 0.1 * index
  const x = (distance + angle) * Math.cos(angle)
  const z = (distance + angle) * Math.sin(angle)

  return {
    photo,
    position: {
      x,
      y: 0,
      z,
    },
    rotation: {
      x: 0,
      y: -angle,
      z: 0,
    },
    size: photoSceneSize(photo),
  }
}

export const makePhotoScenes = (photos: Array<Photo>): Array<PhotoScene> => photos.map(photoScene)
