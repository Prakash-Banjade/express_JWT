const express = require('express')
const path = require('path')
const router = express.Router()

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

const employees = [
    {
        id: 1,
        name: 'Prakash Banjade',
        role: 'CTO', 
    },
    {
        id: 2,
        name: 'Shiva Pandey',
        role: 'Director of Engineering'
    },
    {
        id: 3,
        name: 'Elon Musk',
        role: 'CEO'
    }
]

// dynamic routing --> paramaters achieved using req.params.param
router.get('^/$|/employees/:id', (req, res) =>{
    const employee = employees.find(employee => employee.id === Number(req.params.id))
    if (employee) {
        res.send(`
        <p style="font-size: 20px;">Name: <strong>${employee.name}</strong></p>
        <p style="font-size: 20px;">Role: <strong>${employee.role}</strong></p>
        `)
    }else{   
    res.status(404).send(`
    <h1>Employee with id ${req.params.id} not found</h1>
    `)

    }
})

module.exports = router