const args = process.argv.slice(2);
const yargs = require('yargs').parse(args);
const path = require('path');
// todo: 判断ssr config是否存在
const ssrConfig = require(path.resolve('config/ssr'));


const ssrGetArgs = async () => {

    const {
        env = 'development',
        entry = path.resolve("node_modules/react-ssr-with-koa/index.js")
    } = yargs;

    return {
        env,
        webpackEntry: ssrConfig.appEntry,
        entry
    };

};

module.exports = ssrGetArgs;


