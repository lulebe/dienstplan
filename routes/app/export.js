const pdf = require('pdf-creator-node')
const joinPath = require('path').join
const readFile = require('util').promisify(require('fs').readFile)

const { Plan, Shift, PlanNote, User, ShiftOption } = require.main.require('./db')
const dates = require.main.require('./dates')

module.exports = async (req, res) => {
  const plan = await Plan.findByPk(req.params.planId, {include: [{model: Shift, include: ['pickedUser', {model: ShiftOption, include: User}]}, {model: PlanNote, include: User}]})
  const users = (await User.findAll()).sort((u1, u2) => u1.lastName < u2.lastName).map(u => ({
    name: u.fullName,
    email: u.email,
    phone: u.phone
  }))
  const shifts = []
  plan.Shifts.sort((s1, s2) => s1.start < s2.start).forEach(shift => {
    if (shift.pickedUser) {
      shifts.push({
        dt: dates.displayShiftDate(shift.start) + " " + dates.displayShiftTime(shift.start) + "-" + dates.displayShiftTime(shift.end),
        name: shift.pickedUser.fullName,
        phone: shift.pickedUser.phone,
        email: shift.pickedUser.email
      })
    }
  })
  const html = await readFile(joinPath(global.appRoot, 'templates', 'planexport.html'), 'utf8')
  const document = {
    html,
    data: {
      name: plan.name,
      users,
      shifts
    },
    path: joinPath(global.appRoot, 'planexport', req.params.planId + '.pdf')
  }
  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '12mm'
  }
  pdf.create(document, options)
  .then(pdfres => {
    res.status(200)
    res.setHeader('content-type', 'application/pdf')
    res.sendFile(joinPath(global.appRoot, 'planexport', req.params.planId + '.pdf'))
  })
  .catch(e => {
    console.error(e)
    res.status(500).end()
  })
}