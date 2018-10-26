const path = require('path');
const fs = require('fs');
const Router = require('koa-router');

const apiRouter = require('./api');
const pageRouter = require('./page');

const pagesMap = require('../def').pagesMap;
const {PROXY_API_FILENAME_PREFIX} = require('../constants');
const {getCusPageRouter} = require('../context');
const router = new Router();

/**
 * {
 *     root: 'api',
 *     children: ['path1', 'path2']
 * }
 * @return {*}
 */
const getProxyApi = () => {
    const files = fs.readdirSync(path.resolve('_server/'))
    const filtered = files.filter((f) => f.indexOf(PROXY_API_FILENAME_PREFIX) > -1);
    const matchedFile = filtered ? filtered[0] : null;
    if (!matchedFile)
        return {
            root: 'api'
        };

    const parse = (filename) => filename.replace(/\.js/, '');
    const root = parse(
        matchedFile.replace(
            new RegExp(`^${PROXY_API_FILENAME_PREFIX}`),
            ''
        )
    );

    if (matchedFile.indexOf('.js') > -1) {
        return {
            root: root,
            children: []
        }
    }
    return {
        root: root,
        children: fs.readdirSync(path.resolve(`_server/${matchedFile}`)).map((f) => parse(f))
    }
};



// proxyToServer path
const proxyApiConfig = getProxyApi();



router.get('/favicon.ico', (ctx, next) => {
    ctx.status = 200;
    ctx.body = ''
});


// proxy api
router.use(`/${proxyApiConfig.root}`, apiRouter.routes());


// page
Object.keys(pagesMap).forEach((page) => {
    const _router = getCusPageRouter(`${page}.js`);
    if (_router) {
        router.use(`/${page}`, getCusPageRouter(`${page}.js`).routes())
    } else {
        router.use(`/${page}`, pageRouter(page).routes())
    }
});



module.exports = router;