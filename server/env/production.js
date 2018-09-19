const path = require('path');
// const argv = require('minimist')(process.argv.slice(2));

const def = require('../def');

const env = 'Online';

module.exports = {
    pagesPath: path.resolve('build'),
    proxy: def.proxyPath[env],
    port: def.port[env]
};
