const mkdirp = require('mkdirp-then');
const cp = require('recursive-copy');
const { resolve, join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');




const init = async () => {
    await mkdirp(resolve('_server'));
    await mkdirp(resolve('_server/dist'));
    await mkdirp(resolve('_server/log'));
    // await mkdirp(resolve('_server/assets'));

    if (!existsSync(resolve('config/server.js'))) {
        await cp(
            join(__dirname, '../server/_def.js'),
            resolve('config/server.js')
        )
    }


};

module.exports = init;