const router = require('express').Router()
const appRouter = require('express').Router()

const { User } = require('./db')

module.exports = router

router.use((req, res, next) => {
  res.tmplOpts = {isLoggedIn: false}
  next()
})

router.get('/', require('./routes/index'))
router.post('/login', require('./routes/login'))
router.post('/forgotpwd', require('./routes/forgotpwd'))


router.use('/app', userHandler)
router.use('/app', appRouter)

appRouter.get('/main', require('./routes/app/main'))
appRouter.get('/logout', require('./routes/app/logout'))
appRouter.get('/profile', require('./routes/app/profile'))
appRouter.post('/profile', require('./routes/app/profile_post'))
appRouter.get('/admin', [onlyAdmin], require('./routes/app/admin'))
appRouter.post('/admin', [onlyAdmin], require('./routes/app/admin_post'))

appRouter.get('/newplan', [onlyAdmin], require('./routes/app/newplan'))
appRouter.post('/newplan', [onlyAdmin], require('./routes/app/newplan_post'))
appRouter.get('/plan/:planId', require('./routes/app/plan'))

async function userHandler (req, res, next) {
  if (!req.session.userId)
    return res.redirect('/')
  res.tmplOpts.isLoggedIn = true
  res.tmplOpts.user = (await User.findByPk(req.session.userId)).dataValues
  next()
}

async function onlyAdmin (req, res, next) {
  if (res.tmplOpts.user.isAdmin) next()
  else res.status(403).send()
}