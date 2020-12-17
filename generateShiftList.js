const dh = require('date-holidays')

const holidays = new dh('DE', 'HE')

module.exports = function (startdate, enddate) {
  const shiftList = []
  const currentDate = new Date(startdate)
  while (currentDate <= enddate) {
    //add day shift if necessary
    if (needsDayshift(currentDate)) {
      const dayStart = new Date(currentDate)
      dayStart.setHours(8)
      dayStart.setMinutes(0)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(20)
      dayEnd.setMinutes(0)
      const dayPriority = currentDate.getDay() === 6 ? 3 : 2 //saturday highest priority, other days less
      shiftList.push({start: dayStart, end: dayEnd, priority: dayPriority})
    }
    //add night shift
    const nightStart = new Date(currentDate)
    nightStart.setHours(needsDayshift(currentDate) ? 20 : 17)
    nightStart.setMinutes(0)
    const nightEnd = new Date(currentDate)
    currentDate.setDate(currentDate.getDate() + 1)
    nightEnd.setHours(needsDayshift(currentDate) ? 8 : 7)
    nightEnd.setMinutes(0)
    nightEnd.setDate(nightEnd.getDate() + 1)
    const nightPriority = 1 //night lowest priority
    shiftList.push({start: nightStart, end: nightEnd, priority: nightPriority})
  }
  return shiftList
}

function needsDayshift (currentDate) {
  const isHoliday = holidays.isHoliday(currentDate) && holidays.isHoliday(currentDate).type === 'public'
  const isChristmas = currentDate.getMonth() == 11 && currentDate.getDate() == 24
  return currentDate.getDay() === 0 || currentDate.getDay() === 6 || isHoliday || isChristmas
}
