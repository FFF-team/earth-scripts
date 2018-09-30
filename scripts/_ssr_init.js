const mkdirp = require('mkdirp-then');
const cp = require('recursive-copy');
const { resolve, join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');




const init = async () => {
    await mkdirp(resolve('_server/dist'));
    await mkdirp(resolve('_server/router'));

    if (!existsSync(resolve('_server/def.js'))) {
        await cp(
            join(__dirname, '../server/_def.js'),
            resolve('_server/def.js')
        )
    }

    if (!existsSync(resolve('_server/page.js'))) {
        await cp(
            join(__dirname, '../server/router/_page.js'),
            resolve('_server/page.js')
        )
    }

};

module.exports = init;