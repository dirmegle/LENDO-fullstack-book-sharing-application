import type { Database } from '@server/database'
import { userRepository } from './userRepository'
import { bookRepository } from './bookRepository'
import { bookCopyRepository } from './bookCopyRepository'
import { friendshipRepository } from './friendshipRepository'
import { notificationsRepository } from './notificationsRepository'
import { reservationsRepository } from './reservationsRepository'
import { commentRepository } from './commentRepository'

export type RepositoryFactory = <T>(db: Database) => T

// index of all repositories for provideRepos
const repositories = {
  userRepository,
  bookRepository,
  bookCopyRepository,
  friendshipRepository,
  notificationsRepository,
  reservationsRepository,
  commentRepository,
}

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
