type IndustryIdentifiers = {
  type: string
  identifier: string
}

type ImageLinks = {
  smallThumbnail: string
  thumbnail: string
}

export type VolumeInfo = {
  title: string
  authors: string[]
  description: string
  industryIdentifiers: IndustryIdentifiers[]
  categories: string[]
  imageLinks: ImageLinks
}

export type ReturnedBooks = {
  totalItems: number
  items: Array<{
    volumeInfo: VolumeInfo
  }>
}

export interface NYTBuyLink {
  name: string
  url: string
}

export interface NYTBook {
  rank: number
  rank_last_week: number
  weeks_on_list: number
  asterisk: number
  dagger: number
  primary_isbn10: string
  primary_isbn13: string
  publisher: string
  description: string
  price: string
  title: string
  author: string
  contributor: string
  contributor_note: string
  book_image: string
  book_image_width: number
  book_image_height: number
  amazon_product_url: string
  age_group: string
  book_review_link: string
  first_chapter_link: string
  sunday_review_link: string
  article_chapter_link: string
  buy_links: NYTBuyLink[]
}

export interface NYTBooksList {
  list_id: number
  list_name: string
  list_name_encoded: string
  display_name: string
  updated: 'WEEKLY' | 'MONTHLY'
  list_image?: string | null
  list_image_width?: number | null
  list_image_height?: number | null
  books: NYTBook[]
}

export interface NYTBooksResults {
  bestsellers_date: string
  published_date: string
  published_date_description: string
  previous_published_date: string | null
  next_published_date: string | null
  lists: NYTBooksList[]
}

export interface NYTBooksOverviewResponse {
  status: string
  copyright: string
  num_results: number
  results: NYTBooksResults
}

