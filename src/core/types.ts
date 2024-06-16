export type PhotoSize = {
  url: string
  height: number
  width: number
}

export type Photo = {
  id: string
  title: string
  small: PhotoSize
  medium: PhotoSize
  large: PhotoSize
}

export type PhotoSet = {
  id: string
  title: string
  photos: Array<Photo>
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
