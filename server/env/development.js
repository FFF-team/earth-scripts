const path = require('path');

const def = require('../def');

const env = 'Local';

module.exports = {
    pagesPath: path.resolve('public'),
    proxy: def.proxyPath[env],
    localServer: def.localServer,
    port: def.port[env],
};
