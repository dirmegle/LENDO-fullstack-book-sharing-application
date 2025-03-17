import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { apiBase } from '@/config'
import { getAccessToken } from './utils/isAuthenticated'
import superjson from 'superjson'

console.log('apiBase:', apiBase) 

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: apiBase,
      headers: () => {
        const token = getAccessToken()

        if (!token) return {}

        return {
          Authorization: `Bearer ${token}`,
        }
      },
    }),
  ],
})
