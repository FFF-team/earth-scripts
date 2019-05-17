const args = process.argv.slice(2);
const yargs = require('yargs').parse(args);
const path = require('path');
// todo: 判断ssr config是否存在
const ssrConfig = require(path.resolve('config/ssr'));


const ssrGetArgs = async () => {

    const {
        env = 'development',
        entry = ''
    } = yargs;

    return {
        env,
        webpackEntry: ssrConfig.appEntry || {},
        entry,
        serverPort: ssrConfig.serverPort || '8001',
        devWatchFiles: ssrConfig.devWatchFiles || []
    };

};

module.exports = ssrGetArgs;


