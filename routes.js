const router = require('express').Router()

module.exports = router

router.get('/', require('./routes/index'))
router.get('/main', require('./routes/main'))