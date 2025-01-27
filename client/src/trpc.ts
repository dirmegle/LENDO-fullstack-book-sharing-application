import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
// import { apiBase } from '@/config'
import { getAccessToken } from './utils/isAuthenticated'
import superjson from 'superjson'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/v1/trpc',
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
