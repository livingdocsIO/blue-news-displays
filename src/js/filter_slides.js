import { DateTime, Interval } from 'luxon'

export function filterSlides (slides) {
  return slides.filter((slide) => {
    return isWithinDaysSchedule(slide) && isWithinTimeSchedule(slide)
  })
}

function isWithinDaysSchedule (slide) {
  const daysSchedule = slide.config.daysSchedule
  if (!daysSchedule || !daysSchedule.length) return true

  const mapping = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  }
  const mappedDays = daysSchedule.map((entry) => mapping[entry])
  const currentDayInWeek = new Date().getDay()
  return mappedDays.includes(currentDayInWeek)
}

function isWithinTimeSchedule (slide) {
  const timeSchedule = slide.config.timeSchedule
  if (!timeSchedule || !(timeSchedule.from && timeSchedule.to)) return true

  const dateNow = DateTime.now()
  const dateFrom = DateTime.fromJSDate(new Date(timeSchedule.from))
  const dateTo = DateTime.fromJSDate(new Date(timeSchedule.to))

  // correct the days
  if (dateFrom.isValid && dateTo.isValid) {
    if (!dateFrom.hasSame(dateTo, 'day')) {
      dateTo.set({ day: dateNow.get('day') + 1 })
    }
  }
  if (dateFrom.isValid) {
    dateFrom.set({ day: dateNow.get('day')})
  }

  // check whether it's whithin the schedule
  if (dateFrom.isValid && dateTo.isValid) {
    return Interval.fromDateTimes(dateFrom, dateTo).contains(dateNow)
  } else if (dateFrom.isValid) {
    return dateNow >= dateFrom
  } else if (dateTo.isValid) {
    return dateNow <= dateTo
  }

  return true
}
