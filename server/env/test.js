const path = require('path');

const def = require('../def');

const env = 'Test';

module.exports = {
    pagesPath: path.resolve('build'),
    proxy: def.proxyPath[env],
    port: def.port[env]
};
