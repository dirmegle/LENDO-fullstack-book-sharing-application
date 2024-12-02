import type { ReservationWithISOString } from '@server/entities/reservation'

const areDatesAvailable = (
  startDate: string,
  endDate: string,
  existingReservationPeriods: Pick<
    ReservationWithISOString,
    'startDate' | 'endDate'
  >[]
) => {
  const newStartDate = new Date(startDate)
  const newEndDate = new Date(endDate)

  const overlaps = []

  existingReservationPeriods.forEach((period) => {
    const existingStartDate = new Date(period.startDate)
    const existingEndDate = new Date(period.endDate)

    if (
      (newStartDate > existingStartDate && newStartDate < existingEndDate) ||
      (existingStartDate > newStartDate && existingStartDate < newEndDate)
    ) {
      overlaps.push(period)
    }
  })

  return !(overlaps.length > 0)
}

export default areDatesAvailable
