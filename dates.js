const moment = require('moment')
require('moment/locale/de')

moment.locale('de')

module.exports = {displayDate}

function displayDate (dt) {
  return moment(dt).format("dddd, Do MMMM YYYY")
}