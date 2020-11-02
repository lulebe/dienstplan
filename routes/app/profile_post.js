const bcrypt = require('bcrypt')

const config = require.main.require('./config')
const mailer = require.main.require('./email')

module.exports = async (req, res, next) => {
  if (req.body.pwChange) await pwChange(req, res, next)
  else if (req.body.mailChange) await mailChange(req, res, next)
  else if (req.body.nameChange) await nameChange(req, res, next)
  else if (req.body.phoneChange) await phoneChange(req, res, next)
  next()
}

async function nameChange (req, res) {
  if (req.body.firstName && req.body.lastName) {
    req.user.firstName = req.body.firstName
    req.user.lastName = req.body.lastName
    await req.user.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
}

async function phoneChange (req, res) {
  if (req.body.phone) {
    req.user.phone = req.body.phone
    await req.user.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
}

async function mailChange (req, res) {
  if (req.body.newmail) {
    const oldmail = req.user.email
    req.user.email = req.body.newmail
    await req.user.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
    sendMailchangeMails(oldmail, req.body.newmail, req.user.firstName + ' ' + req.user.lastName)
  }
}

async function pwChange (req, res) {
  if (req.body.pwnew && req.body.pwold && req.body.pwnewmatch) {
    if (req.body.pwnew === req.body.pwnewmatch) {
      const pwCorrect = await bcrypt.compare(req.body.pwold, req.user.password)
      if (pwCorrect) {
        req.user.password = await bcrypt.hash(req.body.pwnew, await bcrypt.genSalt(config.SALT_ROUNDS))
        await req.user.save()
        res.tmplOpts.successMsg = "Passwort wurde geändert."
      }
    } else
      res.tmplOpts.errorMsg = "Passwörter stimmen nicht überein."
  }
}

function sendMailchangeMails (oldMail, newMail, name) {
  return Promise.all([
    mailer(oldMail, 'Dienstplan E-Mail geändert', 'Hallo ' + name + ',\n\ndeine hinterlegte Mailadresse wurde geändert von ' + oldMail + ' zu ' + newMail + '.'),
    mailer(newMail, 'Dienstplan E-Mail geändert', 'Hallo ' + name + ',\n\ndeine hinterlegte Mailadresse wurde geändert von ' + oldMail + ' zu ' + newMail + '.')
  ])
}