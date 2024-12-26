import { userSchema } from "@server/entities/user";
import { userRepository } from "@server/repositories/userRepository";
import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
import provideRepos from "@server/trpc/provideRepos";
import { TRPCError } from "@trpc/server";

export default authenticatedProcedure.use(provideRepos({userRepository})).input(userSchema.pick({email: true})).mutation( async ({input: {email}, ctx: {authUser, repos}}) => {
    const userWithUpdatedEmail = await repos.userRepository.findByEmail(email)

    if(userWithUpdatedEmail) {
        throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'We could not find an account with this email address',
           })
    }

    const userWithNewEmail = await repos.userRepository.updateEmail(email, authUser.id)

    return userWithNewEmail
})