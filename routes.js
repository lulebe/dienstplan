const router = require('express').Router()
const appRouter = require('express').Router()

module.exports = router


router.get('/', require('./routes/index'))
router.post('/login', require('./routes/login'))
router.post('/forgotpwd', require('./routes/forgotpwd'))


router.use('/app', appRouter)

appRouter.get('/main', require('./routes/app/main'))