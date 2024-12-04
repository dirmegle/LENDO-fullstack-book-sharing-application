import type { Repositories } from '@server/repositories'
import { v4 as uuidv4 } from 'uuid'
import type {
  EntityTypeEnum,
  ReservationStatusEnum,
  StatusEnum,
  User,
} from '../../database/types'
import messages from './notificationMessages'

const formulateFriendshipNotification = (
  status: StatusEnum,
  fromUserFullProfile: User
) => {
  let message
  const fromUserFullName = `${fromUserFullProfile.firstName} ${fromUserFullProfile.lastName}`

  if (status === 'accepted') {
    message = messages.friendshipAcceptMessage(fromUserFullName)
  } else if (status === 'declined') {
    message = messages.friendshipDeclineMessage(fromUserFullName)
  } else if (status === 'pending') {
    message = messages.friendshipRequestMessage(fromUserFullName)
  } else if (status === 'deleted') {
    message = messages.friendshipDeletionMessage(fromUserFullName)
  } else {
    throw new Error('could not formulate notification message')
  }

  return message
}

// TODO: Add logic with commenting feature
const formulateCommentNotification = () => 'Comment notification message'

const formulateReservationNotification = (
  status: ReservationStatusEnum,
  fromUserFullProfile: User,
  bookName: string
) => {
  let message
  const fromUserFullName = `${fromUserFullProfile.firstName} ${fromUserFullProfile.lastName}`

  if (status === 'pending') {
    message = messages.reservationPendingMessage(fromUserFullName, bookName)
  } else if (status === 'cancelled') {
    message = messages.reservationCancelledMessage(fromUserFullName, bookName)
  } else if (status === 'completed') {
    message = messages.reservationCompletedMessage(fromUserFullName, bookName)
  } else if (status === 'confirmed') {
    message = messages.reservationConfirmedMessage(fromUserFullName, bookName)
  } else if (status === 'rejected') {
    message = messages.reservationRejectedMessage(fromUserFullName, bookName)
  } else {
    throw new Error('could not formulate notification message')
  }

  return message
}

const getNotificationMessage = (
  entity: EntityTypeEnum,
  status: StatusEnum | ReservationStatusEnum,
  fromUserFullProfile: User,
  bookName?: string
) => {
  let notificationMessage

  if (entity === 'friendship') {
    notificationMessage = formulateFriendshipNotification(
      status as StatusEnum,
      fromUserFullProfile
    )
  } else if (entity === 'comment') {
    notificationMessage = formulateCommentNotification()
  } else if (entity === 'reservation') {
    if (!bookName) {
      throw new Error(
        'Book name must be provided for reservation notifications'
      )
    }
    notificationMessage = formulateReservationNotification(
      status as ReservationStatusEnum,
      fromUserFullProfile,
      bookName
    )
  } else {
    throw new Error('Entity must be one of friendship, comment or reservation')
  }

  return notificationMessage
}

const createNotification = async (
  entity: EntityTypeEnum,
  entityId: string,
  status: StatusEnum | ReservationStatusEnum,
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
