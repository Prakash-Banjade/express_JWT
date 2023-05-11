const router = require('express').Router()
const registerUser = require('../controller/userRegisterController')

router.post('/', registerUser)

module.exports = router