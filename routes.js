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
appRouter.post('/profile', [require('./routes/app/profile_post')], require('./routes/app/profile'))
appRouter.get('/admin', [onlyAdmin], require('./routes/app/admin'))
appRouter.post('/admin', [onlyAdmin, require('./routes/app/admin_post')], require('./routes/app/admin'))
appRouter.get('/admin/edituser/:userId', [onlyAdmin], require('./routes/app/edituser'))
appRouter.post('/admin/edituser/:userId', [onlyAdmin, require('./routes/app/edituser_post')], require('./routes/app/edituser'))

appRouter.get('/newplan', [onlyAdmin], require('./routes/app/newplan'))
appRouter.post('/newplan', [onlyAdmin], require('./routes/app/newplan_post'))

appRouter.get('/plan/:planId', require('./routes/app/plan'))
appRouter.post('/plan/:planId', [require('./routes/app/plan_post')], require('./routes/app/plan'))

appRouter.get('/plan/:planId/delete', [onlyAdmin], require('./routes/app/plan_delete'))
appRouter.get('/plan/:planId/scheduling', [onlyAdmin], require('./routes/app/scheduling'))
appRouter.post('/plan/:planId/scheduling', [onlyAdmin, require('./routes/app/scheduling_post')], require('./routes/app/scheduling'))

appRouter.get('/plan/:planId/export', require('./routes/app/export'))

async function userHandler (req, res, next) {
  if (!req.session.userId)
    return res.redirect('/')
  res.tmplOpts.isLoggedIn = true
  req.user = await User.findByPk(req.session.userId)
  res.tmplOpts.user = req.user.dataValues
  next()
}

async function onlyAdmin (req, res, next) {
  if (req.user.isAdmin) next()
  else res.status(403).send()
}