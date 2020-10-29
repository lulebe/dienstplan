const tmpl = require.main.require('./templates')
const { Plan } = require.main.require('./db')
const dates = require.main.require('./dates')

module.exports = async (req, res) => {
  const plan = await Plan.findByPk(req.params.planId)
  res.tmplOpts.plan = plan.dataValues
  res.tmplOpts.plan.start = dates.displayDate(res.tmplOpts.plan.start)
  res.tmplOpts.plan.end = dates.displayDate(res.tmplOpts.plan.end)
  tmpl.render('app/plan.twig', res.tmplOpts).then(rendered => res.end(rendered))
}