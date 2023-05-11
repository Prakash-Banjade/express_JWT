const cors = require('cors')

const whtieLists = ['http://localhost:3500', 'https://www.google.com', 'http://127.0.0.1']

const corsOptions = {
    origin: (origin, callback) => {
        if (whtieLists.indexOf(origin) !== -1 || !origin) {
            callback(null, true) 
        }else{
            callback(new Error(`${origin} blocked by CORS policy`)) // callback(error, send response back to origin)
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = cors(corsOptions)