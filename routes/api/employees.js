const express = require('express')
const router = express.Router()
const employeesController = require('../../controller/employeesController')
const verifyJWTs = require('../../middleware/verifyJWTs')


router.route('/')
    .get(verifyJWTs, employeesController.fetchAllEmployees)
    .post(employeesController.addNewEmployees)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployee)
    
module.exports = router