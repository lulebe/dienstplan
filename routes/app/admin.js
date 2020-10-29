const tmpl = require.main.require('./templates')
const { User } = require.main.require('./db')

module.exports = async (req, res) => {
  res.tmplOpts.users = (await User.findAll()).map(u => u.dataValues)
  tmpl.render('app/admin.twig', res.tmplOpts).then(rendered => res.end(rendered))
}