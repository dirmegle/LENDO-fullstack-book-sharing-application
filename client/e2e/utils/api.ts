import { apiOrigin, apiPath } from './config'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../../server/src/shared/trpc'
import { fakeUserWithId } from './fakeData'
import type { Page } from '@playwright/test'
import superjson from 'superjson'
import { setAccessTokenCookie, removeAccessTokenCookie } from '../../src/utils/isAuthenticated'
import { User } from '@server/shared/types'

let accessToken: string | null = null

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${apiOrigin}${apiPath}`,
      headers: () => {
        return {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        }
      },
    }),
  ],
})

type UserLogin = Parameters<typeof trpc.user.signup.mutate>[0]
type UserLoginAuthed = UserLogin & { user: User; accessToken: string, expirationDate: string }

/**
 * Logs in a new user by signing them up and logging them in with the provided
 * user login information.
 */
export async function loginNewUser(
  page: Page,
  userLogin: UserLogin = fakeUserWithId()
): Promise<UserLoginAuthed> {
  try {
    await trpc.user.signup.mutate(userLogin)
  } catch {
    // ignore cases when user already exists
  }

  const loginResponse = await trpc.user.login.mutate(userLogin)
  // const userId = JSON.parse(atob(loginResponse.accessToken.split('.')[1])).user.id

  return loginResponse
}

export async function asUser<T>(
  page: Page,
  userLogin: UserLogin,
  callback: (user: UserLoginAuthed) => Promise<T>
): Promise<T> {
  // running independent tasks in parallel
  const [user] = await Promise.all([
    loginNewUser(page, userLogin),
    (async () => {
      // if no page is open, go to the home page
      if (page.url() === 'about:blank') {
        await page.goto('/')
        await page.waitForURL('/')
      }
    })(),
  ])

    accessToken = user.accessToken

  if (accessToken) {
    await page.evaluate(
    ({ accessToken }) => {
        setAccessTokenCookie(accessToken, user.expirationDate)
      localStorage.setItem('token', accessToken)
    },
    { accessToken }
  )
  }
  
  const callbackResult = await callback(user)

  await page.evaluate(() => {
    removeAccessTokenCookie()
  })
  accessToken = null

  return callbackResult
}
