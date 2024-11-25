export const friendshipRequestMessage = (authorFullName: string) =>
  `User ${authorFullName} has send you a friendship request`

export const friendshipAcceptMessage = (authorFullName: string) =>
  `User ${authorFullName} has accepted your friendship request`

export const friendshipDeclineMessage = (authorFullName: string) =>
  `User ${authorFullName} has declined your friendship request`

export const friendshipDeletionMessage = (authorFullName: string) =>
  `User ${authorFullName} has removed you as a friend. You will no longer see their book copies.`
