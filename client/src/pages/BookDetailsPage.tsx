import { useLocation } from 'react-router-dom';
import noCover from '@/assets/images/noCover.png'
import type { Book } from '@server/shared/types';
import { Badge } from '@/components/Badge';
import { useState } from 'react';
import { Button } from '@/components/Button';
import Add from '@/assets/icons/add.svg?react'
import CheckMark from '@/assets/icons/checkMark.svg?react'

export default function BookDetailsPage() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const book = location.state as Book

  const categories = book.categories.split(',')

  const isBookInUserList = false

  if (!book) {
    return <div>No book data available</div>;
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='md:h-72 h-36 w-full border border-border bg-accent-peach'></div>
      <div className='flex md:flex-row flex-col gap-2 justify-center sm:max-w-[80%] sm:items-start items-center'>
        <div className='md:min-h-[360px] md:min-w-[240px] h-[270px] w-[180px] -mt-12'>
          <img
            src={book.coverImage ? book.coverImage : noCover}
            alt={`Cover image for ${book.title} by ${book.author}`}
            className="h-full w-full object-cover"
          />
          <div className='w-full flex flex-row gap-1 mt-1'>
            <Button size="full">Reservations</Button>
            <Button size="icon" variant='accentPurple'>{isBookInUserList ? <CheckMark /> : <Add />}</Button>
          </div>
        </div>
        <div className='flex flex-col gap-1 sm:items-start items-center'>
          <h6 className='mt-10 sm:mt-2'>{book.author}</h6>
          <h3 className='text-4xl sm:text-left text-center'>{book.title}</h3>
          <p className='text-xs'>{book.isbn}</p>
          <div className='flex gap-2 mb-4'>
            {categories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
          </div>
          <p className={`${!isExpanded ? 'line-clamp-4' : ''}`}>
            {book.description}
          </p>
          <Button size='text' variant="link" onClick={() => setIsExpanded(prev => !prev)}>{isExpanded ? 'See less' : 'See more'}</Button>
        </div>
      </div>
    </div>
  );
}