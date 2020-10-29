const tmpl = require.main.require('./templates')

module.exports = (req, res) => {
  res.tmplOpts.plans = [{id: 1, name: "Januar"}, {id: 2, name: "März"}]
  tmpl.render('app/main.twig', res.tmplOpts).then(rendered => res.end(rendered))
}