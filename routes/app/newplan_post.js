const { Plan, Shift } = require.main.require('./db')
const generateShiftList = require.main.require('./generateShiftList')

module.exports = async (req, res) => {
  console.log(req.body)
  if (!req.body.name || !req.body.startdate || !req.body.enddate)
    return res.redirect('/app/newplan?status=0')
  const plan = await Plan.create({
    name: req.body.name,
    start: new Date(Date.parse(req.body.startdate)),
    end: new Date(Date.parse(req.body.enddate))
  })
  //TODO create Shifts
  const shiftList = generateShiftList(plan.start, plan.end)
  shiftList.forEach(shift => {
    shift.PlanId = plan.id
  })
  await Shift.bulkCreate(shiftList)
  res.redirect('/app/main')
}