import { DateTime, Interval } from 'luxon'

export function filterSlides (slides) {
  return slides.filter((slide) => {
    return isWithinDateSchedule(slide) && isWithinDaysSchedule(slide) && isWithinTimeSchedule(slide)
  })
}

function isWithinDateSchedule (slide) {
  const dateSchedule = slide.config.dateSchedule
  if (!dateSchedule || !(dateSchedule.from && dateSchedule.to)) return true

  const dateNow = DateTime.now()
  const dateFrom = DateTime.fromJSDate(new Date(dateSchedule.from))
  const dateTo = DateTime.fromJSDate(new Date(dateSchedule.to))

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
  const dateFromBase = DateTime.fromJSDate(new Date(timeSchedule.from))
  const dateFrom = dateFromBase.isValid && DateTime.fromISO(dateNow.toISODate()).set({
    hour: dateFromBase.get('hour'),
    minute: dateFromBase.get('minute')
  })
  const dateToBase = DateTime.fromJSDate(new Date(timeSchedule.to))
  const dateTo = dateToBase.isValid && DateTime.fromISO(dateNow.toISODate()).set({
    hour: dateToBase.get('hour'),
    minute: dateToBase.get('minute')
  })

  // correct the days
  if (dateFrom && dateTo && dateTo <= dateFrom) {
    dateTo.plus({ days: 1 })
  }

  // check whether it's whithin the schedule
  if (dateFrom && dateTo) {
    return Interval.fromDateTimes(dateFrom, dateTo).contains(dateNow)
  } else if (dateFrom) {
    return dateNow >= dateFrom
  } else if (dateTo) {
    return dateNow <= dateTo
  }

  return true
}
