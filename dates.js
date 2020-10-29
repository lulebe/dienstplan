const moment = require('moment')
require('moment/locale/de')

moment.locale('de')

module.exports = {displayDate, displayShiftDate, displayShiftTime}

function displayDate (dt) {
  return moment(dt).format("dddd, Do MMMM YYYY")
}

function displayShiftDate (dt) {
  return moment(dt).format("dd DD.MM.")
}

function displayShiftTime (dt) {
  return moment(dt).format("HH:mm")
}