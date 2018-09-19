const mkdirp = require('mkdirp-then');
const cp = require('recursive-copy');
const { resolve, join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
// require('../server/router/_api')




const init = async () => {
    await mkdirp(resolve('_server/dist'));
    await mkdirp(resolve('_server/router'));

    if (!existsSync(resolve('_server/router/api.js'))) {
        await cp(
            join(__dirname, '../server/router/_api.js'),
            resolve('_server/router/api.js')
        )
    }

    if (!existsSync(resolve('_server/router/page.js'))) {
        await cp(
            join(__dirname, '../server/router/_page.js'),
            resolve('_server/router/page.js')
        )
    }

};

module.exports = init;