const messages = {
  friendshipRequestMessage: (authorFullName: string) =>
    `User ${authorFullName} has sent you a friendship request`,

  friendshipAcceptMessage: (authorFullName: string) =>
    `User ${authorFullName} has accepted your friendship request`,

  friendshipDeclineMessage: (authorFullName: string) =>
    `User ${authorFullName} has declined your friendship request`,

  friendshipDeletionMessage: (authorFullName: string) =>
    `User ${authorFullName} has removed you as a friend. You will no longer see their book copies.`,

  reservationPendingMessage: (authorFullName: string, bookName: string) =>
    `User ${authorFullName} has sent you a book reservation request for book ${bookName}`,

  reservationCancelledMessage: (authorFullName: string, bookName: string) =>
    `User ${authorFullName} has cancelled book reservation for book ${bookName}.`,

  reservationCompletedMessage: (authorFullName: string, bookName: string) =>
    `User ${authorFullName} has completed the reservation for book ${bookName}.`,

  reservationConfirmedMessage: (authorFullName: string, bookName: string) =>
    `User ${authorFullName} has confirmed your reservation for book ${bookName}.`,

  reservationRejectedMessage: (authorFullName: string, bookName: string) =>
    `User ${authorFullName} has rejected your reservation for book ${bookName}.`,
}

export default messages
