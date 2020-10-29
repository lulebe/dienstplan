const tmpl = require.main.require('./templates')
const { Plan } = require.main.require('./db')

module.exports = async (req, res) => {
  const plans = await Plan.findAll()
  res.tmplOpts.plans = plans.map(p => p.dataValues)
  tmpl.render('app/main.twig', res.tmplOpts).then(rendered => res.end(rendered))
}