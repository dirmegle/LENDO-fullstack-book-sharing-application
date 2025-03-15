import BookCard from '@/components/BookCard'
import NoResultsMessage from '@/components/NoResultsMessage'
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs'
import { trpc } from '@/trpc'
import { BookCopy } from '@server/database/types'
import { useEffect, useState } from 'react'
import illustrationLibrary from '@/assets/images/illustrationLibrary.png'
import { useSearchParams } from 'react-router-dom'

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('activeTab') ?? 'personal';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ownerBooks, setOwnerBooks] = useState<BookCopy[]>([]);
  const [friendsBooks, setFriendsBooks] = useState<BookCopy[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      const ownerBooksData = await trpc.bookCopy.getBookCopiesByUser.query();
      setOwnerBooks(ownerBooksData);
      const friendsBooksData = await trpc.bookCopy.getBookCopiesFromFriends.query();
      setFriendsBooks(friendsBooksData);
    };

    getBooks();
  }, []);

  const handleTabChange = (newTabValue: string) => {
    searchParams.set("activeTab", newTabValue);
    setSearchParams(searchParams);
    setActiveTab(newTabValue);
  };

  const getBooksByTabValue = () => {
    return activeTab === 'personal' ? ownerBooks : friendsBooks;
  };

  return (
    <div>
      <h1 className="font-medium text-3xl mb-4">Library</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2" variant="peach">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
      </Tabs>
      {getBooksByTabValue().length > 0 ? (
        <div className="mt-6 grid 2xl:grid-cols-7 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2">
          {getBooksByTabValue().map((bookCopy) => (
            <BookCard
              key={bookCopy.id}
              bookCopy={bookCopy}
              showOwner={activeTab === 'friends'}
            />
          ))}
        </div>
      ) : (
        <div className='mt-8'>
          <NoResultsMessage
            message="No books to display yet"
            illustrationLink={illustrationLibrary}
          />
        </div>
      )}
    </div>
  );
}
