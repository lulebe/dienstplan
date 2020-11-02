const moment = require('moment')
require('moment/locale/de')
require('moment-timezone')

moment.locale('de')

module.exports = {displayDate, displayShiftDate, displayShiftTime}

function displayDate (dt) {
  return moment(dt).tz('Europe/Brussels').format("dddd, Do MMMM YYYY")
}

function displayShiftDate (dt) {
  return moment(dt).tz('Europe/Brussels').format("dd DD.MM.")
}

function displayShiftTime (dt) {
  return moment(dt).tz('Europe/Brussels').format("HH:mm")
}