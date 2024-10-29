type IndustryIdentifiers = {
  type: string
  identifier: string
}

type ImageLinks = {
  smallThumbnail: string | null
  thumbnail: string | null
}

export type VolumeInfo = {
  title: string
  authors: string[]
  description: string
  industryIdentifiers: IndustryIdentifiers[]
  categories: (string | null)[]
  imageLinks: ImageLinks
}

export type ReturnedBooks = {
  totalItems: number
  items: Array<{
    volumeInfo: VolumeInfo
  }>
}
