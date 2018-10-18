const path = require('path');

const def = require('../def');

const env = 'Test';

module.exports = {
    proxy: def.proxyPath[env],
    port: def.port[env]
};
