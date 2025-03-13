import { reservationsRepository } from '@server/repositories/reservationsRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { z } from 'zod'

const inputSchema = z.object({ role: z.enum(['reserver', 'owner']) })

export default authenticatedProcedure
  .use(
    provideRepos({
      reservationsRepository,
    })
  )
  .input(inputSchema)
  .query(async ({ input: { role }, ctx: { repos, authUser } }) => {
    const reservations =
      role === 'owner'
        ? await repos.reservationsRepository.getReservationsByOwnerId(
            authUser.id
          )
        : await repos.reservationsRepository.getReservationsByReserverId(
            authUser.id
          )
  
    return reservations
  })
