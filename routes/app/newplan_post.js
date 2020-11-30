const mailer = require.main.require('./email')
const { Plan, Shift, User } = require.main.require('./db')
const generateShiftList = require.main.require('./generateShiftList')

module.exports = async (req, res) => {
  if (!req.body.name || !req.body.startdate || !req.body.enddate)
    return res.redirect('/app/newplan?status=0')
  const plan = await Plan.create({
    name: req.body.name,
    start: new Date(Date.parse(req.body.startdate)),
    end: new Date(Date.parse(req.body.enddate))
  })
  const shiftList = generateShiftList(plan.start, plan.end)
  shiftList.forEach(shift => {
    shift.PlanId = plan.id
  })
  await Shift.bulkCreate(shiftList)
  res.redirect('/app/main')
  sendInfoEmails(plan)
}


async function sendInfoEmails (plan) {
  const users = await User.findAll()
  mailer(
    users.map(u => ({email: u.email, name: u.firstName})),
    'Neuer Plan verfügbar',
    'Schichtwünsche im neuen Plan "' + plan.name + '" können jetzt eingetragen werden.',
    'Schichtwünsche im neuen Plan "' + plan.name + '" können jetzt eingetragen werden.'
  )
}
