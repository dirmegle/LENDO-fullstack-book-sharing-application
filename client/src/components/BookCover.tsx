import noCover from '@/assets/images/noCover.png'
import classNames from 'classnames'

interface BookCoverProps {
  coverImage: string
  title: string
  author: string
  isLarge?: boolean 
}

export default function BookCover({ coverImage, title, author, isLarge = false }: BookCoverProps) {

  const coverClasses = classNames(
    'border border-border',
    {
      'w-[100px] h-[150px] min-w-[100px] min-h-[150px]': isLarge,
      'w-[60px] h-[90px] min-w-[60px] min-h-[90px]': !isLarge,
    }
  )

  return (
    <div className={coverClasses}>
      <img 
        src={coverImage !== "" ? coverImage : noCover} 
        alt={`Book cover for ${title} by ${author}`} 
        className="h-full w-full object-cover"
      />
    </div>
  )
}
