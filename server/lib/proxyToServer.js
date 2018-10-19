const Base = require('./ProxyBase');



const httpProxy = require('http-proxy');
const zlib = require('zlib');
// const config = require('../env');
const checkOnline = require('../util/checkOnline');
const _http = checkOnline() ? require('https') : require('http');
const logger = require('../util/logger');

const agent = _http.Agent({
    keepAlive: true,
    maxSockets: 10,
    maxFreeSockets: 6,
    keepAliveMsecs: 1000
});

const proxy = httpProxy.createProxyServer({
    ignorePath: true
});

// todo; 优化

class ProxyToServer extends Base {

    constructor(req, res, ctx) {
        super();

        this.req = req;
        this.res = res;
    }

    static ctx = null;


    static onProxyRes(proxyRes, req, res) {

        const _this = this;

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
                formatData = JSON.stringify(Object.assign({}, JSON.parse(formatData), {__fns: true}))
            } catch (e) {
                logger.error(e)
            }

            res.statusCode = 200;
            res.write(formatData);
            res.end()
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

                // todo: 用emit实现
                // unzip，返回body, headers数据
                zlib.unzip(body, (err, buffer) => {

                    _this.ctx._app_proxy.emit('proxyRes', req, res, buffer.toString(), send);


                })
            } else {

                // 普通未压缩请求，直接toString()

                delete proxyRes.headers['content-length'];


                _this.ctx._app_proxy.emit('proxyRes', req, res, body.toString(), send);


            }

        });
    }

    to (other, ctx) {

        proxy.web(this.req, this.res,
            {
                selfHandleResponse : true,
                changeOrigin: true,
                agent: agent,
                ...other
            }
        );
    }


}


proxy.on('proxyReq', function (proxyReq, req, res, options) {
    // 如果是POST  && 有自定义传入的body
    // 重新buffer
    if (req.method === 'POST' && req._consuming && req._body) {
        let bodyData = JSON.stringify(req._body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        // stream the content
        proxyReq.write(bodyData)
    }
});
proxy.on('proxyRes', function (proxyRes, req, res) {
    ProxyToServer.onProxyRes(proxyRes, req, res)
});
proxy.on('error',  (e) => {
    logger.error(e.stack);
});

module.exports = ProxyToServer;