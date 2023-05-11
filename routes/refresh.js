const router = require('express').Router()
const refreshTokenController = require('../controller/refreshTokenController.js')

router.post('/', refreshTokenController)

module.exports = router