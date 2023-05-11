const users = {
    database: require('../model/users.json'),
    setData: function(newData){this.database = newData}
}

const fsPromises = require('fs').promises
const path = require('path')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()  // configure .env environment

const loginUser = async (req, res) => {
    // getting username and pwd from the request body
    const {username, pwd} = req.body

    // checking if the username and pwd are supplied
    if (!username || !pwd) return res.status(400).json({
        "error": true,
        "message": 'both username and pwd must not be empty'
    })

    // finding the user
    const foundUser = users.database.find(user => user.username === username)
    if (!foundUser) {
        // return res.sendStatus(401) // unauthorized
        return res.status(401).json({error: 'from line 27 - userLoginController.js'}) // unauthorized
    }

    // evaluating the password
    const isPwdMatch = await bcrypt.compare(pwd, foundUser.password)

    // if password matches
    if (isPwdMatch) {

        // after the password is matched the create JWTs (access token and refresh token)
        const accessToken = jwt.sign(
            {username}, // don't pass the user password for other security reasons
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        )

        const refreshToken = jwt.sign(
            {username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )

        // saving refresh token with current user
        const otherUsers = users.database.filter(user => user.username !== username)
        const currentUser = {...foundUser, refreshToken}

        users.setData([...otherUsers, currentUser])
        
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(users.database)
        )

        // sending the JWTs to the user --> here access token and refresh token are sent separately for sake of simplicity for frontend developer, they shouldn't be stored in localstorage or cookies or any other approach that can be accessed by Js. They must be stored in local memory. Here, refrest token is sent through cookie but it can be accessed though httpOnly not by js
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24*3600*1000})
        res.json({accessToken})
    }else{
        res.status(401).json({
            error: true,
            message: '401 unauthorized - incorrect password'
        })
    }  
}

module.exports = loginUser