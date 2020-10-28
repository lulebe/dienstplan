const tmpl = require.main.require('./templates')

module.exports = (req, res) => {
  tmpl.render('index.twig', {isLoggedIn: false, isAdmin: false}).then(rendered => res.end(rendered))
}