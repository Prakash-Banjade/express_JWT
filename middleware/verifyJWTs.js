const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWTs = (req, res, next) => {
    const authHeader = req.headers['authorization'] // getting authorization from headers
    if (!authHeader) return res.sendStatus(401) // unauthorized

    console.log(authHeader) // will logs out -> Bearer token
    const token = authHeader.split(' ')[1] // the token that user sent/have

    // jwts verification
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403) // forbidden - invalid token || doesn't received token

            req.user = decoded.username; 
            next();
        }
    )
    next();
}

module.exports = verifyJWTs