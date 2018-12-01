const path = require('path');
const fs = require('fs');
const config = require('../def');
const console = require('../../tools').clog.ssr;

const readFile = async (page) => {
    if (process.env.NODE_ENV === 'development') {
        // dev环境下从localhost:3000中拿
        return readFromLocalServer(page);
    } else {
        // prod环境下，从build-pages中拿
        return readFromBuildFile(page);
    }

}

/**
 * prod从本地拿文件
 * @param page
 * @return {Promise}
 */
const readFromBuildFile = (page) => {
    return new Promise((resolve, reject) => {

        const filePath = require('../def').clientBuildPath;

        fs.readFile(path.resolve(filePath, `${page}.html`), 'utf8', (err, data) => {

            if (err) {
                resolve('');
                throw new Error(err)
            }

            resolve(data)
        })
    })

};

/**
 * dev 从localhost:3001拿文件
 * todo: 根据端口号拿
 * @param page
 * @return {Promise}
 */
const readFromLocalServer = (page) => {
    return new Promise((resolve, reject) => {

        const request = require('request');

        request(`${config.staticPath.js}/${page}.html`, (err, response, body) => {
            if (err) {
                console.error(`Are you forget to start 'npm run start'?`);
                reject(err);
            }

            resolve(body)
        })
    })
}

module.exports = {
    readFile
};
