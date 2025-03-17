import {
  fakeFriendshipWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll, selectAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { random } from '@tests/utils/random'
import { uuidRegex } from '@tests/utils/regex'
import { friendshipRepository } from '../friendshipRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = friendshipRepository(db)

const fromUser = fakeUserWithId()
const toUser = fakeUserWithId()

beforeAll(async () => {
  await insertAll(db, 'user', [fromUser, toUser])
})

describe('create', () => {
  it('creates a friendship record', async () => {
    const friendship = fakeFriendshipWithId({
      fromUserId: fromUser.id,
      toUserId: toUser.id,
    })

    const result = await repository.create(friendship)

    expect(result.id).toMatch(uuidRegex)
  })
})

describe('updateStatus', () => {
  it('updates status of friendship with either accepted or declined', async () => {
    const friendship = fakeFriendshipWithId({
      fromUserId: fromUser.id,
      toUserId: toUser.id,
    })

    const [existingFriendship] = await insertAll(db, 'friendship', [friendship])

    await repository.updateStatus(existingFriendship.id, 'accepted')

    const [updatedFriendship] = await selectAll(db, 'friendship', (q) =>
      q('id', '=', existingFriendship.id)
    )

    expect(updatedFriendship.status).toEqual('accepted')
  })

  it('returns undefined if it cannot find the existing friendship', async () => {
    const updatedFriendship = await repository.updateStatus(
      random.guid(),
      'accepted'
    )
    expect(updatedFriendship).toBeUndefined()
  })
})

describe('getExistingFriendship', () => {
  it('returns friendship based on user ids if it exists', async () => {
    const friendship = fakeFriendshipWithId({
      fromUserId: fromUser.id,
      toUserId: toUser.id,
    })

    await insertAll(db, 'friendship', [friendship])

    const foundFriendship = await repository.getExistingFriendship(
      fromUser.id,
      toUser.id
    )

    expect(foundFriendship).toEqual(friendship)
  })
  it('returns undefined if the friendship does not exist', async () => {
    const foundFriendship = await repository.getExistingFriendship(
      random.guid(),
      random.guid()
    )

    expect(foundFriendship).toBeUndefined()
  })
})

describe('findById', () => {
  it('returns friendship by id if exists', async () => {
    const [friendship] = await insertAll(db, 'friendship', [
      fakeFriendshipWithId({ fromUserId: fromUser.id, toUserId: toUser.id }),
    ])
    const foundFriendship = await repository.findById(friendship.id)
    expect(foundFriendship).toEqual(friendship)
  })
  it('returns undefined if the user does not exist', async () => {
    const foundFriendship = await repository.findById(fakeFriendshipWithId().id)
    expect(foundFriendship).toBeUndefined()
  })
})