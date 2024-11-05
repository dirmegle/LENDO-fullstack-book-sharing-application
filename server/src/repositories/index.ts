import type { Database } from '@server/database'
import { userRepository } from './userRepository'
import { bookRepository } from './bookRepository'
import { bookCopyRepository } from './bookCopyRepository'

export type RepositoryFactory = <T>(db: Database) => T

// index of all repositories for provideRepos
const repositories = { userRepository, bookRepository, bookCopyRepository }

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
