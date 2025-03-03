import noCover from '@/assets/images/noCover.png'

interface BookCoverProps {
    coverImage: string
    title: string
    author: string
}

export default function BookCover({coverImage, title, author}: BookCoverProps) {
  return (
    <div className="w-[60px] h-[90px] min-w-[60px] min-h-[90px] mr-2 border border-border">
        <img src={coverImage !== "" ? coverImage : noCover} alt={`Book cover for ${title} by ${author}`} className="h-full w-full object-cover"/>
    </div>
  )
}
