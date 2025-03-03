import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { trpc } from '@/trpc'
import { User, BookCopy, Book } from '@server/shared/types'
import addBook from '@/utils/addBook'

type UserContextType = {
  user: User | null
  userBookCopies: BookCopy[]
  fetchUserData: () => Promise<void>
  fetchUserBookCopies: () => Promise<void>
  checkIfBookIsInUserList: (isbn: string) => boolean
  addBookCopy: (book: Book) => Promise<void>
  removeBookCopy: (isbn: string) => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  userBookCopies: [],
  fetchUserData: async () => {},
  fetchUserBookCopies: async () => {},
  checkIfBookIsInUserList: () => false,
  addBookCopy: async () => {},
  removeBookCopy: async () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userBookCopies, setUserBookCopies] = useState<BookCopy[]>([])

  const fetchUserData = async () => {
    try {
      const data = await trpc.user.getCurrentUser.query()
      setUser(data)
    } catch (err) {
      console.error('Failed to fetch user data', err)
    }
  }

  const fetchUserBookCopies = async () => {
    try {
      const copies = await trpc.bookCopy.getBookCopiesByUser.query()
      setUserBookCopies(copies)
    } catch (err) {
      console.error('Failed to fetch user book copies', err)
    }
  }

  const checkIfBookIsInUserList = (isbn: string): boolean => {
    return userBookCopies.some((copy) => copy.isbn === isbn)
  }

  const addBookCopy = async (book: Book) => {
    try {
      await addBook(book)
      await trpc.bookCopy.addBookCopy.mutate({
        isbn: book.isbn,
        isAvailable: true,
        isLendable: true,
      })
      await fetchUserBookCopies()
    } catch (e) {
      console.error('Failed to add book copy', e)
      throw e
    }
  }

  const removeBookCopy = async (isbn: string) => {
    try {
      const bookCopyId = await trpc.bookCopy.getBookCopyId.query({ isbn: isbn })
      const existingReservations = await trpc.reservation.getActiveReservationsByBookCopy.query({
        bookCopyId: bookCopyId,
      })

      if (existingReservations.length === 0) {
        await trpc.bookCopy.removeBookCopy.mutate({ id: bookCopyId })
        await fetchUserBookCopies()
      }
    } catch (e) {
      console.error('Failed to remove book copy', e)
      throw e
    }
  }

  useEffect(() => {
    fetchUserData()
    fetchUserBookCopies()
  }, [])

  const contextValue: UserContextType = {
    user,
    userBookCopies,
    fetchUserData,
    fetchUserBookCopies,
    checkIfBookIsInUserList,
    addBookCopy,
    removeBookCopy,
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export default function useUserContext() {
  return useContext(UserContext)
}
