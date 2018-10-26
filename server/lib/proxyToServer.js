const httpProxy = require('http-proxy');
const zlib = require('zlib');
// const _http = require('http');
const logger = require('../lib/logger');
const errorBody = require('../lib/error').resBody;
const RES_CODE = require('../lib/error').RES_CODE;

// const agent = _http.Agent({
//     keepAlive: false,
//     maxSockets: 10,
//     maxFreeSockets: 6,
//     keepAliveMsecs: 1000
// });

const proxy = httpProxy.createProxyServer({
    ignorePath: true
});


/**
 *
 * @param data string
 * @return {*}
 */
const parseToJson = (data, req) => {
    let parsedData = null;
    const errorRes = errorBody(RES_CODE.PTS_PARSEFAIL, data);


    try {
        parsedData = JSON.parse(data)
    } catch (e) {
        parsedData = errorRes;


        logger.proxyError({
            path: req.url,
            response: data,
            errorCode: RES_CODE.PTS_PARSEFAIL,
            errorStack: e.stack
        })
    }


    // JSON.parse('null') 'false' '123' 时都不会报错，需要再做一层筛选
    if (typeof parsedData !== 'object' || !parsedData) {
        parsedData = errorRes;

        logger.proxyError({
            path: req.url,
            response: data,
            errorCode: RES_CODE.PTS_PARSEFAIL,
            errorStack: `JSON.parse(${data})结果不是object`
        })
    }

    return parsedData

}

// todo; 优化

class ProxyToServer {

    constructor(req, res) {

        this.req = req;
        this.res = res;
    }


    static onProxyRes(proxyRes, req, res) {

        // setHeaders
        const setHeaders = (fields) => {
            for (const key in fields) {
                res.setHeader(key, fields[key]);
            }
        };

        // res.write
        const send = (formatData) => {
            setHeaders(proxyRes.headers);


            try {
                formatData.__fns = true;
                formatData = JSON.stringify(formatData)
            } catch (e) {
                formatData = JSON.stringify(errorBody(RES_CODE.SEND_TO_CLIENT_ERROR, formatData));

                logger.proxyError({
                    path: req.url,
                    response: formatData,
                    errorCode: RES_CODE.SEND_TO_CLIENT_ERROR,
                    errorStack: e.stack
                });

            }


            logger.proxyInfo({
                path: req.url,
                method: req.method,
                query: req.query || JSON.stringify(req._body),
                status: 200,
                response: formatData
            });

            res.statusCode = 200;
            res.write(formatData);
            res.end();


        };


        let body = new Buffer('');
        proxyRes.on('data', function (data) {
            body = Buffer.concat([body, data]);
        });
        proxyRes.on('end', function () {

            // 判断原请求是否已经gzip压缩过了
            const gzipped = /gzip/.test(proxyRes.headers["content-encoding"]);

            if (gzipped) {

                // 删除掉原来掉原来response.headers的content-encoding
                delete proxyRes.headers['content-encoding'];
                delete proxyRes.headers['transfer-encoding'];

                // unzip，返回body, headers数据
                zlib.unzip(body, (err, buffer) => {

                    const dataString = buffer.toString();
                    const dataObject = parseToJson(dataString, req);

                    res._app_proxy(dataObject, send);


                })
            } else {

                // 普通未压缩请求，直接toString()

                delete proxyRes.headers['content-length'];


                const dataString = body.toString();
                const dataObject = parseToJson(dataString, req);

                res._app_proxy(dataObject, send);


            }

        });
    }

    static proxyToWeb(req, res, other, ctx) {
        proxy.web(req, res,
            {
                changeOrigin: true,
                // agent: agent,
                headers: {
                    ip: '',
                    'x-origin-ip': ctx.headers['x-forwarded-for'] || ctx.ip
                },
                ...other
            }
        );
    }


    to (other, ctx) {

        ProxyToServer.proxyToWeb(this.req, this.res, other, ctx)

    }

    asyncTo(other, ctx) {
        return new Promise((resolve, reject) => {

            ProxyToServer.proxyToWeb(this.req, this.res, other, ctx)

            ctx.res.on('close', () => {
                reject(new Error('Http response closed while proxying'));
            });

            ctx.res.on('error', (e) => {
                reject(e/*new Error('Http response error while proxying')*/);
            });

            ctx.res.on('finish', () => {
                resolve();
            });

        })
    }

    static onProxyError(e, req, res) {

        const data = JSON.stringify(errorBody(RES_CODE.PTS_ERROR, e.toString()));


        logger.proxyError({
            path: req.url,
            response: data,
            errorCode: RES_CODE.PTS_ERROR,
            errorStack: e.stack
        });



        res.statusCode = 200;
        // err: 代理失败
        res.write(JSON.stringify(errorBody(RES_CODE.PTS_ERROR, e.toString())));
        res.end()

    }


}

// 使用agent,当sockets小于并发时会报错
// 压测bug Can't set headers after they are sent with bodyParser()
// todo: 暂时未找到根本性原因
proxy.on('proxyReq', function (proxyReq, req, res, options) {

    if (!req._body || !Object.keys(req._body).length) {
        return;
    }

    // 只考虑application/json情况
    // 如果是POST  && 有自定义传入的body
    // 重新buffer
    if (req.method === 'POST' && req._body) {
        let bodyData = JSON.stringify(req._body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        // stream the content
        proxyReq.write(bodyData);
        proxyReq.end()
    }
});
proxy.on('proxyRes', function (proxyRes, req, res) {
    if (res._app_selfHandleResponseApi) {
        ProxyToServer.onProxyRes(proxyRes, req, res)
    }
});
proxy.on('error',  (e, req, res) => {
    ProxyToServer.onProxyError(e, req, res)
});

module.exports = ProxyToServer;