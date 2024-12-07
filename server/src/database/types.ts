/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from 'kysely'

export type EntityTypeEnum = 'comment' | 'friendship' | 'reservation'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type StatusEnum = 'accepted' | 'declined' | 'deleted' | 'pending'

export type Timestamp = ColumnType<Date, Date | string>

export interface Book {
  author: string
  categories: string
  coverImage: string
  description: string
  isbn: string
  title: string
}

export interface BookCopy {
  id: string
  isAvailable: boolean
  isbn: string
  isLendable: boolean
  ownerId: string
}

export interface Friendship {
  fromUserId: string
  id: string
  status: StatusEnum
  toUserId: string
}

export interface Notification {
  createdAt: Generated<Timestamp>
  entityId: string
  entityType: EntityTypeEnum
  id: string
  isRead: boolean
  message: string
  triggeredById: string
  userId: string
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
  friendship: Friendship
  notification: Notification
  user: User
}
