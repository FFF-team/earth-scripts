const Router = require('koa-router');
const router = new Router();

const config = require('../def');
const {selfHandleResponseApi} = require('../def');
const logger = require('../lib/logger');

const Proxy2Server = require('../lib/proxyToServer');

// const {getCusProxyRouter} = require('../context');
// const defaultRouter = getCusProxyRouter('index.js');

module.exports = ({
                      apiProxyBefore = () => {},
                      apiProxyReceived = () => {},
                      prefix
}) => {

    router.all('/:other*',
        // proxy before, change body or something
        async (ctx, next) => {
            if (apiProxyBefore) {
                await apiProxyBefore(ctx);
            }
            await next()
        },
        // proxy after
        async (ctx, next) => {

            const req = ctx.req;
            const res = ctx.res;

            const _app_proxyOption = ctx._app_proxyOption || {headers: {}};
            const proxyPath = ctx.request.url.replace(new RegExp(`/${prefix}`), '');

            res._app_selfHandleResponseApi = _app_proxyOption.selfHandleResponse || selfHandleResponseApi;

            const proxyOption = {
                selfHandleResponse: res._app_selfHandleResponseApi,
                headers: _app_proxyOption.headers || {},
                target: `${_app_proxyOption.target || config.proxyPath}/${proxyPath}`,
            };

            const _app_proxy = new Proxy2Server(req, res);




            if (res._app_selfHandleResponseApi) {
                ctx.respond = false;

                // 在res上挂载_app_proxy
                res._app_proxy = (dataObj, send) => {
                    send(dataObj)
                };

                if (apiProxyReceived) {
                    apiProxyReceived(req, res);
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

    return router
};

