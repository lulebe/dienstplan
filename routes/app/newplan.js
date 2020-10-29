const tmpl = require.main.require('./templates')

module.exports = (req, res) => {
  tmpl.render('app/newplan.twig', res.tmplOpts).then(rendered => res.end(rendered))
}