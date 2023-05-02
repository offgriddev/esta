import {differenceInHours, addDays} from 'date-fns'
// the duration cannot include weekends
// determine workable days
// subtract non-workable hours from difference in days
// then perform check
function getNonWorkableDays(startDate: Date, endDate: Date): number {
  let numOfNonWorkableDays = 0
  for (let d = startDate; d < endDate; d = addDays(d, 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) numOfNonWorkableDays++
  }

  return numOfNonWorkableDays
}

export function getDuration(startDate: string, endDate: string): number {
  const startDt = new Date(startDate)
  const endDt = new Date(endDate)
  const nonWorkableDays = getNonWorkableDays(startDt, endDt)
  const durationInHours = differenceInHours(endDt, startDt)
  const nonWorkableHours = nonWorkableDays * 24
  const workableDuration = durationInHours - nonWorkableHours
  const workedHours = workableDuration / 24
  return Math.round(workedHours * 100) / 100.0
}
