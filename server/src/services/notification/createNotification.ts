import type { Repositories } from '@server/repositories'
import { v4 as uuidv4 } from 'uuid'
import type {
  EntityTypeEnum,
  ReservationStatusEnum,
  FriendshipStatusEnum,
  User,
} from '../../database/types'
import messages from './notificationMessages'

const getNotificationMessage = (
  entity: EntityTypeEnum,
  status: FriendshipStatusEnum | ReservationStatusEnum,
  fromUserFullProfile: User,
  bookName?: string
) => {
  
  const entityMessages = messages[entity]
  const authorFullName = `${fromUserFullProfile.firstName} ${fromUserFullProfile.lastName}`

  if (!entityMessages || !(status in entityMessages)) {
    throw new Error(`Unsupported status '${status}' for entity '${entity}'`);
  }

 if (entity === 'reservation') {
    if (!bookName) {
      throw new Error(
        'Book name must be provided for reservation notifications'
      )
    }
    return messages.reservation[status as ReservationStatusEnum](authorFullName, bookName)
  } if (entity === 'friendship') {
    return messages.friendship[status as FriendshipStatusEnum](authorFullName)
  } 
    throw new Error('Entity must be either friendship or notification')
}

const createNotification = async (
  entity: EntityTypeEnum,
  entityId: string,
  status: FriendshipStatusEnum | ReservationStatusEnum,
  toUserId: string,
  fromUserId: string,
  repos: Pick<
    Repositories,
    'notificationsRepository' | 'userRepository' | 'bookRepository'
  >,
  isbn?: string
) => {
  const fromUserFullProfile =
    await repos.userRepository.findByUserId(fromUserId)

  if (!fromUserFullProfile) {
    throw new Error(
      'Could not find existing user profiles. Make sure users are registered.'
    )
  }

  let bookData

  if (!isbn && entity === 'reservation') {
    throw new Error(
      'ISBN must be provided for notifications with entity type Reservation'
    )
  } else if (isbn) {
    bookData = await repos.bookRepository.findByISBN(isbn)
  }

  try {
    const notificationMessage = getNotificationMessage(
      entity,
      status,
      fromUserFullProfile,
      bookData?.title
    )

    await repos.notificationsRepository.create({
      entityId,
      entityType: entity,
      id: uuidv4(),
      isRead: false,
      message: notificationMessage ?? '',
      triggeredById: fromUserId,
      userId: toUserId,
    })
  } catch (error) {
    throw new Error(`Failed to create a notification: ${error}`)
  }
}

export default createNotification
