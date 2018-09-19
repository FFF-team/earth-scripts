const console = require('../tools').clog.ssr;
console.info(`current environment: development`);

/**
 * 1. webpack watch
 * 2. nodemon start server
 */
require('./_ssr-watch')()
    .then((ret) => {

        require('./_ssr_start')

    }, () => {
        console.log('watch fail')
    });




// exec('npm run build', () => {
//     exec('pm2 start ./server/ecosystem.config.js')
// });