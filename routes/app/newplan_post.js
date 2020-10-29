const { Plan } = require.main.require('./db')

module.exports = async (req, res) => {
  console.log(req.body)
  if (!req.body.name || !req.body.startdate || !req.body.starttime || !req.body.enddate || !req.body.endtime)
    return res.redirect('/app/newplan?status=0')
  await Plan.create({
    name: req.body.name,
    start: new Date(Date.parse(req.body.startdate)),
    end: new Date(Date.parse(req.body.enddate))
  })
  //TODO create Shifts
  res.redirect('/app/main')
}