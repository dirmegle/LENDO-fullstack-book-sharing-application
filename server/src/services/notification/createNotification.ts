import type { Repositories } from '@server/repositories'
import { v4 as uuidv4 } from 'uuid'
import type { EntityTypeEnum, StatusEnum, User } from '../../database/types'
import {
  friendshipAcceptMessage,
  friendshipDeclineMessage,
  friendshipDeletionMessage,
  friendshipRequestMessage,
} from './notificationMessages'

const formulateFriendshipNotification = (
  status: StatusEnum,
  fromUserFullProfile: User
) => {
  let message
  const fromUserFullName = `${fromUserFullProfile.firstName} ${fromUserFullProfile.lastName}`

  if (status === 'accepted') {
    message = friendshipAcceptMessage(fromUserFullName)
  } else if (status === 'declined') {
    message = friendshipDeclineMessage(fromUserFullName)
  } else if (status === 'pending') {
    message = friendshipRequestMessage(fromUserFullName)
  } else if (status === 'deleted') {
    message = friendshipDeletionMessage(fromUserFullName)
  } else {
    throw new Error('could not formulate notification message')
  }

  return message
}

// TODO: Add logic with commenting feature
const formulateCommentNotification = () => 'Comment notification message'

// TODO: Add logic with reservation feature
const formulateReservationNotification = () =>
  'Reservation notification message'

const getNotificationMessage = (
  entity: EntityTypeEnum,
  status: StatusEnum,
  fromUserFullProfile: User
) => {
  let notificationMessage

  if (entity === 'friendship') {
    notificationMessage = formulateFriendshipNotification(
      status,
      fromUserFullProfile
    )
  } else if (entity === 'comment') {
    notificationMessage = formulateCommentNotification()
  } else if (entity === 'reservation') {
    notificationMessage = formulateReservationNotification()
  } else {
    throw new Error('Entity must be one of friendship, comment or reservation')
  }

  return notificationMessage
}

const createNotification = async (
  entity: EntityTypeEnum,
  entityId: string,
  status: StatusEnum,
  toUserId: string,
  fromUserId: string,
  repos: Pick<Repositories, 'notificationsRepository' | 'userRepository'>
) => {
  const fromUserFullProfile =
    await repos.userRepository.findByUserId(fromUserId)

  if (!fromUserFullProfile) {
    throw new Error(
      'Could not find existing user profiles. Make sure users are registered.'
    )
  }

  try {
    const notificationMessage = getNotificationMessage(
      entity,
      status,
      fromUserFullProfile
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
