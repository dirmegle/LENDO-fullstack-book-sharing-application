/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

export interface Book {
  author: string
  coverImage: string | null
  description: string
  isbn: string
  pageCount: number | null
  title: string
}

export interface BookCopy {
  id: string
  isAvailable: boolean
  isbn: string
  isLendable: boolean
  ownerId: string
}

export interface User {
  email: string
  firstName: string
  id: string
  lastName: string
  password: string
}

export interface DB {
  book: Book
  bookCopy: BookCopy
  user: User
}
