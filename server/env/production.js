const path = require('path');
// const argv = require('minimist')(process.argv.slice(2));

const def = require('../def');

const env = 'Online';

module.exports = {
    proxy: def.proxyPath[env],
    port: def.port[env]
};
