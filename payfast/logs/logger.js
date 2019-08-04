const winston = require('winston')
const fs = require('fs')

if(!fs.existsSync('logs')){
    fs.mkdirSync('logs')
}

module.exports = new winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'payfast.log',
            maxsize: 100000,
            maxFiles: 10,

        })
    ]
})

//logger.log('info', 'Log com winston')
//logger.info('Log com info()')