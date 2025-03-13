import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import type { Book } from '@server/database'
import { TRPCError } from '@trpc/server'
import { bookRepository } from '../../repositories/bookRepository'
import { fetchData } from './utils/fetch'
import type { NYTBooksOverviewResponse } from './utils/types'
import fetchBookByISBN from './utils/fetchBookByISBN'
import getISBN from './utils/getISBN'

export default authenticatedProcedure
  .use(provideRepos({ bookRepository }))
  .query(async ({ ctx: { repos } }) => {

    const { env } = process;
    const url = `https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${env.NYT_API_KEY}`;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const todayDateISO = todayDate.toISOString();

    const existingDailyRead = await repos.bookRepository.getBookByDailyRead(todayDateISO);
    if (existingDailyRead) {
      return existingDailyRead;
    }

    const result = await fetchData(url) as NYTBooksOverviewResponse;
    const bookList = result.results.lists[0].books;

    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    for (const book of bookList) {
      const combinedISBN = getISBN(book)
      const existingBook = await repos.bookRepository.getBookByISBN(combinedISBN)

      if (existingBook) {
        if (!existingBook.dailyRead) {
          const updatedBook = await repos.bookRepository.addDailyReadDate(todayDateISO, combinedISBN);
          return updatedBook;
        } 
      } else {
        try {
          const newBook = await fetchBookByISBN(book) as Book
          const createdBook = await repos.bookRepository.create({
            ...newBook,
            dailyRead: todayDateISO
          });
          return createdBook;
        } catch {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not add new book with daily read record'
          });
        }
      }
    }
    /* eslint-enable no-await-in-loop, no-restricted-syntax */

    throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not add new book with daily read record'
      });
  });
