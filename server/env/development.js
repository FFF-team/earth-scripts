const path = require('path');

const def = require('../def');

const env = 'Local';

module.exports = {
    proxy: def.proxyPath[env],
    localServer: def.localServer,
    port: def.port[env],
};
