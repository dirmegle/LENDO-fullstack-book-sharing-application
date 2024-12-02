import areDatesAvailable from '../areDatesAvailable'

const existingReservationPeriods = [
  {
    startDate: new Date('2024-11-06').toISOString(),
    endDate: new Date('2024-12-16').toISOString(),
  },
]

it('returns true when dates are before existing period', () => {
  const startDate = new Date('2024-10-06').toISOString()
  const endDate = new Date('2024-10-16').toISOString()

  const result = areDatesAvailable(
    startDate,
    endDate,
    existingReservationPeriods
  )
  expect(result).toBeTruthy()
})
it('returns true when dates are after existing period', () => {
  const startDate = new Date('2024-12-26').toISOString()
  const endDate = new Date('2024-12-31').toISOString()

  const result = areDatesAvailable(
    startDate,
    endDate,
    existingReservationPeriods
  )
  expect(result).toBeTruthy()
})
it('returns false when start_date overlaps existing period', () => {
  const startDate = new Date('2024-10-16').toISOString()
  const endDate = new Date('2024-12-31').toISOString()

  const result = areDatesAvailable(
    startDate,
    endDate,
    existingReservationPeriods
  )
  expect(result).toBeFalsy()
})
it('returns false when end_date overlaps existing period', () => {
  const startDate = new Date('2024-10-01').toISOString()
  const endDate = new Date('2024-11-20').toISOString()

  const result = areDatesAvailable(
    startDate,
    endDate,
    existingReservationPeriods
  )
  expect(result).toBeFalsy()
})
it('returns false when new period overlaps existing period', () => {
  const startDate = new Date('2024-11-07').toISOString()
  const endDate = new Date('2024-12-15').toISOString()

  const result = areDatesAvailable(
    startDate,
    endDate,
    existingReservationPeriods
  )
  expect(result).toBeFalsy()
})
