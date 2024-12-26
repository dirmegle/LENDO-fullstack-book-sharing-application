const messages = {
  friendship: {
    accepted: (authorFullName: string) => `User ${authorFullName} has sent you a friendship request`,
    declined: (authorFullName: string) => `User ${authorFullName} has declined your friendship request`,
    deleted: (authorFullName: string) => `User ${authorFullName} has removed you as a friend. You will no longer see their book copies`,
    pending: (authorFullName: string) => `User ${authorFullName} has sent you a friendship request`,
  },
  reservation: {
    pending: (authorFullName: string, bookName: string) =>
      `User ${authorFullName} has sent you a book reservation request for book ${bookName}`,
    cancelled: (authorFullName: string, bookName: string) =>
      `User ${authorFullName} has cancelled book reservation for book ${bookName}.`,
    completed: (authorFullName: string, bookName: string) =>
      `User ${authorFullName} has completed the reservation for book ${bookName}.`,
    confirmed: (authorFullName: string, bookName: string) =>
      `User ${authorFullName} has confirmed your reservation for book ${bookName}.`,
    rejected: (authorFullName: string, bookName: string) =>
      `User ${authorFullName} has rejected your reservation for book ${bookName}.`,
  }
}

export default messages
