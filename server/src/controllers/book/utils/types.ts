type IndustryIdentifier = {
    type: string,
    identifier: string,
}

type ImageLinks = {
    smallThumbnail: string,
    thumbnail: string
}

export type VolumeInfo = {
    title: string,
    authors: string[],
    description: string,
    industryIdentifier: IndustryIdentifier[],
    categories: string[],
    imageLinks: ImageLinks,
}

export type ReturnedBooks = {
    totalItems: number,
    items: Array<{
        volumeInfo: VolumeInfo,
    }>
}