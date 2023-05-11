const router = require('express').Router()
const loginUser = require('../controller/userLoginController.js')

router.post('/', loginUser)

module.exports = router