export const formatDateWithTime = (date: string) => {
    const convertedDate = new Date(date)
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
    return formatter.format(convertedDate)
  }

export const formatDate = (date: string) => {
  const convertedDate = new Date(date)
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return formatter.format(convertedDate)
}