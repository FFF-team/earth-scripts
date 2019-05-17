const mkdirp = require('mkdirp-then');
const cp = require('recursive-copy');
const { resolve, join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');

process.env.IS_SERVER = true;


const init = async () => {
    await mkdirp(resolve('build'));
    await mkdirp(resolve('build/server'));
    await mkdirp(resolve('log'));
    // await mkdirp(resolve('_server/assets'));

    if (!existsSync(resolve('config/server.js'))) {
        await cp(
            join(__dirname, '../server/_def.js'),
            resolve('config/server.js')
        )
    }


};

module.exports = init;