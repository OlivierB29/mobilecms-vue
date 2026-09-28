export type MediaEntry = {
  url?: string
  path?: string
  title?: string
  name?: string
  mimetype?: string
}

export type ContentItem = {
  id?: string | number
  slug?: string
  title?: string
  name?: string
  description?: string
  subtitle?: string
  details?: string
  body?: string
  content?: string
  summary?: string
  date?: string
  datetime?: string
  enddate?: string
  updated?: string
  created?: string
  publish_date?: string
  location?: string
  url?: string
  images?: MediaEntry[]
  media?: MediaEntry[]
  attachments?: MediaEntry[]
  image?: MediaEntry | null
}

export type ClubItem = ContentItem & {
  city?: string
  activity?: string
  department?: string
  coordinates?: string
}

export type ActivityItem = ContentItem & {
  mapicon?: string
  logo?: string
  rgbcolor?: string
  color?: string
}

export type SocialNetwork = {
  title?: string
  url?: string
  icon?: string
}

export type SiteMetadata = {
  title?: string
  fulltitle?: string
  keywords?: string
  banner?: {
    imageurl?: string
    imagealt?: string
  }
  socialnetworks?: SocialNetwork[]
  googlecalendar?: {
    embedurl?: string
  }
}
