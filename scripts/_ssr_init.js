const mkdirp = require('mkdirp-then');
const cp = require('recursive-copy');
const { resolve, join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');




const init = async () => {
    await mkdirp(resolve('_server'));
    await mkdirp(resolve('_server/dist'));
    await mkdirp(resolve('_server/log'));
    await mkdirp(resolve('_server/page'));

    if (!existsSync(resolve('_server/def.js'))) {
        await cp(
            join(__dirname, '../server/_def.js'),
            resolve('_server/def.js')
        )
    }


};

module.exports = init;