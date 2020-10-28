const tmpl = require.main.require('./templates')

module.exports = (req, res) => {
  tmpl.render('index.twig', {isLoggedIn: false, isAdmin: false, hasError: !!req.query.status, errorMsg: makeMsg(req.query.status)}).then(rendered => res.end(rendered))
}

function makeMsg (code) {
  switch (code) {
    case 1:
      return "Ein neues Passwort wurde per E-Mail zugestellt."
    case 2:
      return "E-Mail nicht gefunden. Bei Bedarf Admins informieren."
    case 3:
      return "E-Mail oder Passwort sind inkorrekt."
  }
}