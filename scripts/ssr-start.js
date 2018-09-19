const console = require('../tools').clog.ssr;
console.info(`current environment: development`);


/**
 * 0. init
 * 1. webpack watch
 * 2. nodemon start server
 */

const ssrStart = async () => {
    await require('./_ssr_init')();

    try {
        await require('./_ssr-watch')();
    } catch (e) {
        console.log('watch fail');
        return;
    }

    require('./_ssr_start')

};

ssrStart();







// exec('npm run build', () => {
//     exec('pm2 start ./server/ecosystem.config.js')
// });