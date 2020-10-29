const tmpl = require.main.require('./templates')
const { User } = require.main.require('./db')

module.exports = async (req, res) => {
  tmpl.render('app/profile.twig', res.tmplOpts).then(rendered => res.end(rendered))
}

//TODO allow name & email edit