const Base = require('./ProxyBase');



const httpProxy = require('http-proxy');
const zlib = require('zlib');
// const config = require('../env');
const checkOnline = require('../util/checkOnline');
const _http = checkOnline() ? require('https') : require('http');
const logger = require('../util/logger');
const errorBody = require('../util/error').resBody;
const RES_CODE = require('../util/error').RES_CODE;

const agent = _http.Agent({
    keepAlive: true,
    maxSockets: 10,
    maxFreeSockets: 6,
    keepAliveMsecs: 1000
});

const proxy = httpProxy.createProxyServer({
    ignorePath: true
});


/**
 *
 * @param data string
 * @return {*}
 */
const checkProxyRes = (data) => {
    let parsedData = null;


    try {
        parsedData = JSON.parse(data)
    } catch (e) {
        logger.error(e.stack)
    }

    return parsedData

}

// todo; 优化

class ProxyToServer extends Base {

    constructor(req, res) {
        super();

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

            formatData.__fns = true;

            try {
                formatData = JSON.stringify(formatData)
            } catch (e) {
                logger.error(e)
            }


            logger.info(`
        path: ${req.url}
        status: ${200},
        response: ${formatData}
        method: ${req.method}
        query: ${req.query || JSON.stringify(req._body)}
        `
            );

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
                    const dataObject = checkProxyRes(dataString);

                    dataObject ?
                        res._app_proxy(dataObject, send) :
                        send(errorBody(RES_CODE.PTS_PARSEFAIL, dataString));


                })
            } else {

                // 普通未压缩请求，直接toString()

                delete proxyRes.headers['content-length'];


                const dataString = body.toString();
                const dataObject = checkProxyRes(dataString);

                dataObject ?
                    res._app_proxy(dataObject, send) :
                    send(errorBody(RES_CODE.PTS_PARSEFAIL, dataString));


            }

        });
    }


    to (other) {

        proxy.web(this.req, this.res,
            {
                selfHandleResponse : true,
                changeOrigin: true,
                agent: agent,
                ...other
            }
        );
    }

    static onProxyError(e, req, res) {
        logger.error(e.stack);


        res.statusCode = 200;
        // err: 代理失败
        res.write(JSON.stringify(errorBody(RES_CODE.PTS_ERROR, e.toString())));
        res.end()

    }


}

// todo: 压测bug Can't set headers after they are sent with bodyParser()
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
    ProxyToServer.onProxyRes(proxyRes, req, res)
});
proxy.on('error',  (e, req, res) => {
    ProxyToServer.onProxyError(e, req, res)
});

module.exports = ProxyToServer;