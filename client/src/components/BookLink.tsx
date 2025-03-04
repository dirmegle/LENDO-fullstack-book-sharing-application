import BookCover from './BookCover'

interface BookLinkProps {
    coverImage: string
    title: string
    author: string
    isbn: string
    onClick: () => void
}

export default function BookLink({coverImage, title, author, isbn, onClick}: BookLinkProps) {

  return (
    <div className="flex flex-row mb-2 hover:bg-muted-purple hover:cursor-pointer p-2 items-center" onClick={onClick}>
      <BookCover coverImage={coverImage} title={title} author={author}/>
    <div className="flex flex-col justify-center ml-2">
        <h4 className="text-base font-semibold">{title}</h4>
        <h6 className="text-sm">{author}</h6>
        <p className="text-xs">{isbn}</p>
    </div>
    </div>
  )
}
