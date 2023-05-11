const users = {
    database: require('../model/users.json'),
    setData: function(newData){this.database = newData}
}

const jwt = require('jsonwebtoken')
require('dotenv').config()  // configure .env environment

// const handleRefreshToken = (req, res) => {
//     const refreshToken = req.cookies.jwt;

//     if (!refreshToken) {
//         return res.status(403).json({ error: "No refresh token provided" });
//     }

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ error: "Invalid refresh token" });
//         }

//         const foundUser = users.database.find(
//             (user) => user.username === decoded.username && user.refreshToken === refreshToken
//         );

//         if (!foundUser) {
//             return res.status(403).json({ error: "User not found or invalid refresh token" });
//         }

//         const accessToken = jwt.sign(
//             { username: decoded.username },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: "30s" } // set the expiry time as desired
//         );

//         res.json({ accessToken });
//     });
// };

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = users.database.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = handleRefreshToken;