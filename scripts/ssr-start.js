process.env.IS_SERVER = 'true';
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const console = require('../tools').clog.ssr;
const del = require('del');
const path = require('path');
const yargs = require('yargs');


console.info(`current environment: development`);

const args = process.argv.slice(2);
const entry = yargs.parse(args).entry || require.resolve("../server/index.js");


/**
 * 0. init
 * 1. webpack watch
 * 2. nodemon start server
 */

const ssrStart = async () => {
    await require('./_ssr_init')();


    del(path.resolve('_server/dist'));


    try {
        await require('./_ssr-watch')({
            entry: entry
        });
    } catch (e) {
        console.log(e);
        console.log('watch fail');
        return;
    }

    require('./_ssr_start')

};

ssrStart();