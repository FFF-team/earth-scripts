const winston = require('winston');
const { createLogger, format } = require('winston');
const { combine, timestamp, label, json, printf } = format;
const path = require('path');
const fs = require('fs');
const {logDir} = require('../def');
require('winston-daily-rotate-file');


if (!fs.existsSync(logDir)) {
    try {
        fs.mkdirSync(logDir)
    } catch (e) {
        console.log(e)
    }
}

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.message}`;
});


const commonOption = {
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
};

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
    transports: [
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
