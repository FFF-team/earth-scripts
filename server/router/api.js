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

        const req = ctx.req;
        const res = ctx.res;
        const params = ctx.params;

        const _app_proxy = new Proxy2Server(req, res);

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
        await _app_proxy.to({
            selfHandleResponse: true,
            headers: {
                ip: '',
                'x-origin-ip': ctx.headers['x-forwarded-for'] || ctx.ip
            },
            target: `${ctx.app_proxyServer || config.get('proxy')}/${params.name}/${params.other}`,
        });


    }
);