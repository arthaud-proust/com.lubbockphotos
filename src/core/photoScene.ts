import { Photo, PhotoScene, PhotoSceneSize } from './types'

export const photoSceneSize = (photo: Photo): PhotoSceneSize => {
  return {
    height: photo.large.height,
    width: photo.large.width,
    depth: 10,
  }
}

const spiralPoint = (index: number) => {
  const startAt = 2
  const a = 0
  const grow = 1
  const pointsDistance = 3

  const theta = Math.sqrt((2 * Math.PI * (startAt + index) * pointsDistance) / grow)
  const r = a + grow * theta

  return {
    polar: {
      theta,
      r,
    },
    cartesian: toCartesian(theta, r),
  }
}

const toCartesian = (theta: number, r: number) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
})

export const photoScene = (photo: Photo, index: number): PhotoScene => {
  const { cartesian, polar } = spiralPoint(index)

  return {
    photo,
    position: {
      x: cartesian.x,
      y: 0,
      z: cartesian.y,
    },
    rotation: {
      x: 0,
      y: Math.PI / 2 - polar.theta,
      z: 0,
    },
    size: photoSceneSize(photo),
  }
}

export const makePhotoScenes = (photos: Array<Photo>): Array<PhotoScene> => photos.map(photoScene)
