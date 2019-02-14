const Router = require('koa-router');
const router = new Router();
// const path = require('path');
// const fs = require('fs');

const apiRouter = require('./_api');
// const {PROXY_API_FILENAME_PREFIX} = require('../constants');

/**
 * {
 *     root: 'api',
 *     children: ['path1', 'path2']
 * }
 * @return {*}
 */
// const getProxyApi = () => {
//     const files = fs.readdirSync(path.resolve('_server/'));
//     const filtered = files.filter((f) => f.indexOf(PROXY_API_FILENAME_PREFIX) > -1);
//     const matchedFile = filtered ? filtered[0] : null;
//     if (!matchedFile)
//         return {
//             root: 'api'
//         };
//
//     const parse = (filename) => filename.replace(/\.js/, '');
//     const root = parse(
//         matchedFile.replace(
//             new RegExp(`^${PROXY_API_FILENAME_PREFIX}`),
//             ''
//         )
//     );
//
//     if (matchedFile.indexOf('.js') > -1) {
//         return {
//             root: root,
//             children: []
//         }
//     }
//     return {
//         root: root,
//         children: fs.readdirSync(path.resolve(`_server/${matchedFile}`)).map((f) => parse(f))
//     }
// };

// proxyToServer path
// const proxyApiConfig = getProxyApi();





module.exports = ({
                      prefix = 'api',
                      apiProxyBefore = () => {},
                      apiProxyReceived = () => {}
}) => {

    // proxy api
    router.use(`/${prefix}`, apiRouter({apiProxyBefore, apiProxyReceived, prefix}).routes());

    return router
};