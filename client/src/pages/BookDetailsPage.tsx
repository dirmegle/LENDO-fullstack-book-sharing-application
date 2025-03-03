import { useLocation } from 'react-router-dom';
import type { Book } from '@server/shared/types';
import BookDetailsBlock from '@/components/BookDetails/BookDetailsBlock';
import CommentSection from '@/components/CommentSection/CommentSection';
import ReservationsByBook from '@/components/BookDetails/ReservationsByBook';

export default function BookDetailsPage() {
  const location = useLocation();
  const book = location.state as Book

  return (
    <div className='flex flex-col items-center'>
      <BookDetailsBlock book={book}/>
      <ReservationsByBook book={book} />
      <CommentSection  book={book}/>
    </div>
  );
}