const httpProxy = require('http-proxy');
const zlib = require('zlib');
const config = require('../def');
const _http = require('http');

const agent = _http.Agent({
    keepAlive: true,
    maxSockets: 10,
    maxFreeSockets: 6,
    keepAliveMsecs: 1000
});

// const ins =  proxyToServer(true)
// ins()
function proxyToServer(req, res, {
    selfHandleResponse = false,
    target = `${config.proxyPath}${req.url}`,
    ...other
}) {

    return new Promise((resolve, reject) => {

        const proxy = httpProxy.createProxyServer({
            ignorePath: true
        });

        proxy.web(req, res,
            {
                target: target,
                selfHandleResponse : selfHandleResponse,
                changeOrigin: true,
                agent: agent,
                ...other
            }
        );

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


        proxy.on('proxyRes', (proxyRes, req, res) => {

            if (selfHandleResponse) {

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

                            resolve({
                                headers: proxyRes.headers,
                                body: buffer.toString(),
                                status: proxyRes.statusCode
                            });

                        })
                    } else {

                        // 普通未压缩请求，直接toString()

                        // 返回body, headers数据
                        resolve({
                            headers: proxyRes.headers,
                            body: body.toString(),
                            status: proxyRes.statusCode
                        })

                    }


                });
            }


        });


        proxy.on('error',  (e) => {
            reject(e);
        });

    })

}

module.exports = proxyToServer
