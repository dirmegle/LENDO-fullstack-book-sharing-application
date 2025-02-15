import noCover from '@/assets/images/noCover.png'

interface BookLinkProps {
    coverImage: string
    title: string
    author: string
    isbn: string
    onClick: () => void
}

export default function BookLink({coverImage, title, author, isbn, onClick}: BookLinkProps) {

  return (
    <div className="flex flex-row mb-2 hover:bg-muted-purple p-2" onClick={onClick}>
      <div className="w-[60px] h-[90px] min-w-[60px] min-h-[90px] mr-2 border border-border">
        <img src={coverImage !== "" ? coverImage : noCover} alt={`Book cover for ${title} by ${author}`} className="h-full w-full object-cover"/>
      </div>
    <div className="flex flex-col justify-center">
        <h4 className="text-base font-semibold">{title}</h4>
        <h6 className="text-sm">{author}</h6>
        <p className="text-xs">{isbn}</p>
    </div>
    </div>
  )
}
