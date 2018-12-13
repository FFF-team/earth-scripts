const Router = require('koa-router');
const router = new Router();

// const proxyToServer = require('../util/proxyToServer');
// const logger = require('../lib/logger');
// const errorBody = require('../lib/error').resBody;
// const RES_CODE = require('../lib/error').RES_CODE;
const config = require('../def');
const {getCusProxyRouter} = require('../context');
const {selfHandleResponseApi} = require('../def');
const logger = require('../lib/logger');

const Proxy2Server = require('../lib/proxyToServer');


const defaultRouter = getCusProxyRouter('index.js');

module.exports = router;

router.all('/:name/:other*',
    // proxy before, change body or something
    async (ctx, next) => {
        const cusRouter = getCusProxyRouter(ctx.params.name) || defaultRouter;
        if (cusRouter && cusRouter.apiProxyBefore) {
            await cusRouter.apiProxyBefore(ctx);
        }
        await next()
    },
    // proxy after
    async (ctx, next) => {

        const req = ctx.req;
        const res = ctx.res;
        const params = ctx.params;

        const _app_proxyOption = ctx._app_proxyOption || {headers: {}};

        res._app_selfHandleResponseApi = _app_proxyOption.selfHandleResponse || selfHandleResponseApi;

        const proxyOption = {
            selfHandleResponse: res._app_selfHandleResponseApi,
            headers: _app_proxyOption.headers || {},
            target: `${_app_proxyOption.target || config.proxyPath}/${params.name}/${params.other}`,
        };

        const _app_proxy = new Proxy2Server(req, res);




        if (res._app_selfHandleResponseApi) {
            ctx.respond = false;

            // 在res上挂载_app_proxy
            res._app_proxy = (dataObj, send) => {
                send(dataObj)
            };

            // set custom
            const cusRouter = getCusProxyRouter(params.name) || defaultRouter;
            if (cusRouter && cusRouter.apiProxyReceived) {
                await cusRouter.apiProxyReceived(req, res);
            }

            // proxy-to-server
            await _app_proxy.to(proxyOption, ctx);
        } else {

            // proxy-to-server
            await _app_proxy.asyncTo(proxyOption, ctx)
                .catch((e) => {
                    logger.error(e.stack)
                });
        }







    }
);