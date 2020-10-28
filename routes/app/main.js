const tmpl = require.main.require('./templates')

module.exports = (req, res) => {
  tmpl.render('main.twig', {}).then(rendered => res.end(rendered))
}