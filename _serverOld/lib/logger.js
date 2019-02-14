const winston = require('winston');
const { createLogger, format } = require('winston');
const { combine, timestamp, label, json, printf } = format;
const path = require('path');
const fs = require('fs');
let { logDir } = require('../def');
require('winston-daily-rotate-file');

try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }
} catch(e) {
    console.log(e);
    logDir = path.resolve('_server/log');
    console.log(`mkdir fail, now logDir is ${logDir}`)
}


const commonOption = {
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
};

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.message}`;
});

const transports = [
    new winston.transports.Console({ level: 'error' }),
    // new winston.transports.Console(),
    //
    // - Write to all logs with level `info` and below to `combined.log`
    //
    new (winston.transports.DailyRotateFile)(
        Object.assign({}, commonOption, {
            filename: path.join(logDir, './app.log.info-%DATE%'),
            level: 'info',
        })),
    new (winston.transports.DailyRotateFile)(
        Object.assign({}, commonOption, {
            filename: path.join(logDir, './app.log.error-%DATE%'),
            level: 'error',
        })
    )
]

const logger = createLogger({
    // level: 'info',
    exitOnError: false,
    format: combine(
        label({ label: 'msg' }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: transports
});



logger.on('error', function (err) {
    /* Do Something */
    logger.error(err)
});


module.exports = {
    info: logger.info,
    proxyInfo: (option) => {
        logger.info(`
API PROXY -->
   path: ${option.path}
   method: ${option.method}
   query: ${option.query}
   time: ${option.time}
   status: ${option.status},
   response: ${option.response}
        `)
    },
    // errorProxy
    proxyError: (option) => {
        // proxy_api
        logger.error(`
API PROXY ERROR -->
   path: ${option.path},
   response: ${option.response},
   errorCode: ${option.errorCode},
   errorStack: ${option.errorStack} 
            `)
    },
    error: (msg) => {
        logger.error(msg)
    }
};
