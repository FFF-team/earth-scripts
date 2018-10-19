const Router = require('koa-router');
const router = new Router();

// const proxyToServer = require('../util/proxyToServer');
// const logger = require('../util/logger');
// const errorBody = require('../util/error').resBody;
// const RES_CODE = require('../util/error').RES_CODE;
// const {selfHandleResponseApi} = require('../def');
const config = require('../env');
const {getCusProxyRouter} = require('../context')

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

        ctx.respond = false;

        const params = ctx.params;

        const _app_proxy = new Proxy2Server(ctx.req, ctx.res, ctx);

        // 传递ctx
        Proxy2Server.ctx = ctx;

        // 在ctx上挂在_app_proxy
        ctx._app_proxy = _app_proxy;


        // set custom on('proxyRes')
        const cusRouter = getCusProxyRouter(ctx.params.name) || defaultRouter;
        if (cusRouter && cusRouter.apiProxyReceived) {
            await cusRouter.apiProxyReceived(ctx);
        }

        // proxy-to-server
        await _app_proxy.to({
            selfHandleResponse: true,
            headers: {
                ip: '',
                'x-origin-ip': ctx.headers['x-forwarded-for'] || ctx.ip
            },
            target: `${ctx.app_proxyServer || config.get('proxy')}/${params.name}/${params.other}`,
        }, ctx);


    }
);