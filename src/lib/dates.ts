import {addDays, differenceInHours} from 'date-fns'
function getNonWorkableHours(startDate: Date, endDate: Date): number {
  let numOfWorkableHours = 0
  for (let d = startDate; d < endDate; d = addDays(d, 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) numOfWorkableHours++
  }
  return numOfWorkableHours * 24
}

export function getRealisticDuration(
  startDateStr: string,
  endDateStr: string
): number {
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  const durationInHours = differenceInHours(endDate, startDate)
  const nonWorkableHours = getNonWorkableHours(startDate, endDate)
  const workableHours = durationInHours - nonWorkableHours
  return Math.round((workableHours / 24.0) * 100) / 100
}
