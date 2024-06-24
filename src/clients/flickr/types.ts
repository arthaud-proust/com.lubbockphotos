export type FlickrPhoto = {
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
  url_k: string
  height_k: number
  width_k: number
}

export type FlickrPhotoSet = {
  id: string
  owner: string
  username: string
  primary: string
  secret: string
  server: string
  farm: number
  count_views: string
  count_comments: string
  count_photos: number
  count_videos: number
  title: {
    _content: string
  }
  description: {
    _content: string
  }
  can_comment: number
  date_create: string
  date_update: string
  sorting_option_id: string
  photos: number
  videos: number
  visibility_can_see_set: number
  needs_interstitial: number
}
