

const http = require('http');

const start = require('./app');
const env = require('./def');


start().then((app) => {
    const port = env.port;

    const appCallback = app.callback();
    const server = http.createServer(appCallback);


    app.performance();
    app.init();

    server
        .listen(port)
        .on('clientError', (err, socket) => {
            // handleErr(err, 'caught_by_koa_on_client_error');
            socket.end('HTTP/1.1 400 Bad Request Request invalid\r\n\r\n');
        });



    console.log(`Server running on: http://localhost: ${port}`);
});




// todo: hot reload
// let currentApp = appCallback;
/*if (module.hot) {
    module.hot.accept('./app', () => {
        // todo: why and how
        server.removeAllListeners('request', server);
        server.on('request', app.callback())

        // server.removeListener('request', currentApp);
        // currentApp = app.callback();
        // server.on('request', currentApp);
    });
}*/

