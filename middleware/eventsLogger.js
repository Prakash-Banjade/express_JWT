const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises
const { v4: uuid } = require("uuid");
const {format} = require('date-fns')

const eventsLogger = async(message, fileName) => {
    let dateTime = `${format(new Date(), 'yyMMdd\tHH:mm:ss')}`
    let logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try{
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem)

    }catch(e){
        console.log(e)
    }
}

const reqLogger = (req, res, next) => {
    eventsLogger(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLogs.txt')
    next();
}

module.exports = {eventsLogger, reqLogger}