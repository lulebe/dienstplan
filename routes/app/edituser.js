const tmpl = require.main.require('./templates')
const { User } = require.main.require('./db')

module.exports = async (req, res) => {
  const user = await User.findByPk(req.params.userId)
  if (!user) return res.status(404).send()
  res.tmplOpts.u = user.dataValues
  tmpl.render('app/edituser.twig', res.tmplOpts).then(rendered => res.end(rendered))
}

//TODO allow email change