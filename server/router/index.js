const path = require('path');
const fs = require('fs');
const Router = require('koa-router');

const apiRouter = require('./api');
const pageRouter = require('./page');
const staticRouter = require('../middleware/static');

const console = require('../../tools').clog.ssr;
const {PROXY_API_FILENAME_PREFIX} = require('../constants');
const {getCustomRouter} = require('../context')


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



const router = new Router();

// proxyToServer path
let proxyApiConfig = getProxyApi();
// custom router
let cusApiArr = [];





try {
    cusApiArr = fs.readdirSync(path.resolve('_server/router/'))
} catch (e) {
    console.info('you can define your own api in router/api/')
}



// dev环境下针对webpack的热更新接口直接404返回
// todo: more
router.use('/sockjs-node', (ctx, next) => {
    ctx.status = 404;
});

// Serve static assets
router.use('/static', staticRouter());

// api
router.use(`/${proxyApiConfig.root}`, apiRouter.routes());

// other
cusApiArr.forEach((filename) => {
    const path = filename.replace(/\.js/, '');
    const _router = getCustomRouter(filename);

    // other
    _router && router.use(`/${path}`, _router.routes());
});

// page
router.use(pageRouter.routes());





module.exports = router;