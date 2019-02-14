const args = process.argv.slice(2);
const yargs = require('yargs').parse(args);
const path = require('path');
const { resolveApp } = require('../tools');
// todo: 判断ssr config是否存在
const ssrConfig = require(path.resolve('config/ssr'));


const ssrGetArgs = async () => {

    const {
        env = 'development',
        name = 'PROJECT_NAME',
        entry = path.resolve("node_modules/react-ssr-with-koa/src/index.js")
    } = yargs;

    return {
        env,
        name: `${name}_${env}`.toLocaleUpperCase(),
        webpackEntry: ssrConfig.appEntry,
        entry
    };

};

module.exports = ssrGetArgs;


