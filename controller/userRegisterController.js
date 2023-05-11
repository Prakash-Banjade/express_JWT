const users = {
    database: require('../model/users.json'),
    setData: function(newData){this.database = newData}
}

const fsPromises = require('fs').promises
const path = require('path')

const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    // getting username and pwd from the request body
    const {username, pwd} = req.body

    // checking if the username and pwd are supplied
    if (!username || !pwd) return res.status(400).json({
        "error": true,
        "message": 'both username and pwd must not be empty'
    })

    // check if duplicate
    const userExists = users.database.some(user => user.username === username)
    if (userExists) return res.status(409).json({
        "error": true,
        "message": 'user already exists'
    })

    // register new user
    try{
        const newUser = {
            username,
            // hassing the password using bcrypt and adding salt amout to 10
            password: await bcrypt.hash(pwd, 10) 
        }

        users.setData([...users.database, newUser])

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(users.database)
        )

        res.status(201).json({
            message: 'user registered successfully'
        })

    }catch(e){
        res.status(500).json({
            "error": true,
            "message": `500 - ${e.message}`
        })
    }
}

module.exports = registerUser