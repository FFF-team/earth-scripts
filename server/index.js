require('ignore-styles'); // 不处理require('xx.scss')这种文件 https://www.npmjs.com/package/ignore-styles
// require('babel-register');

// 添加global对象
global.document = require('./fakeObject/document');
global.window = require('./fakeObject/window');
global.navigator = window.navigator;

const console = require('../tools').clog;

const Koa = require('koa');
const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');
const gzip = require('koa-compress');

const app = new Koa();
const router = new Router();


const staticRouter = require('./middleware/static');
const performance = require('./middleware/performance');
const apiRouter = require('./router/api');
const pageRouter = require('./router/page');

const logger = require('./util/logger');
const config = require('./env');
const DEF = require('./def');


// todo: 缓存 redis
// todo: 性能问题

app.proxy = true;

// dev环境下针对webpack的热更新接口直接404返回
router.use('/sockjs-node', (ctx, next) => {
    ctx.status = 404;
});
// Serve static assets
router.use('/static', staticRouter());
// api
router.use(`/${DEF.proxyApiPrefix}`, apiRouter.routes());
// page
router.use(pageRouter.routes());

app.use(performance());

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        logger.error(e.stack);
        ctx.body = e.message;
    }
})


// etag无法作用于Stream
// Strings, Buffers, and fs.Stats are accepted
// app.use(conditional());
// app.use(etag());

// 不需要bodyParser
app.use(bodyParser());
app.use((ctx, next) => {
    // 开启了bodyparser
    // 约定，向req中注入_body for "proxyToServer"
    ctx.req._body= ctx.request.body;
    return next();
});
// 如果线上有sourcemap情况，etag和gzip共用会报错stream error
// 针对 static、pages、api自己处理的请求 zip压缩
app.use(gzip({
    // filter: function (content_type) {
    //     console.log(content_type)
    //     return /application\/json/i.test(content_type)
    // },
    threshold: 1024 // response小于 1k 不压缩(默认就是1024)
}));
app.use(router.routes());
app.use(router.allowedMethods());


app.on("error",(err,ctx)=>{//捕获异常记录错误日志
    logger.error(err.stack);
    ctx.body = 'err'
});


app.listen(config.get('port'), () => {
    console.info('success: listening on port 8001...');
});


process.on('uncaughtException', (err) => {
    logger.error('uncaughtException' + err.stack);
    throw err
});

process.on('unhandledRejection', (err) => {
    logger.error('unhandledRejection' + err.stack);
})

/*




// 自定义config路径
process.env["NODE_CONFIG_DIR"] = require('path').resolve(__dirname, "../env/");



// const conditional = require('koa-conditional-get');
// const etag = require('./middleware/etag');








*/




// monitor({
//     title: 'user_center',
//     port: 18001, // 端口号
//     backup: 'backup_zips',// 备份文件夹名
//     deploydir: '/',//要部署的git路径下的文件目录
//     keepBackupNumb: 5, // 保存之前几个备份
//     username: 'admin',
//     password: 'admin123',
//     ignoreBackup: ['.git'],
//     // restartCommond: `npm run ssr:deployTest`,
//     restartCommond: `npm run ssr:deployTest`,
//     mailList: 'kenghongyan@58ganji.com',//邮件发送列表逗号分隔多个，（发生错误手动发送报警邮件）
//     gitPath: 'http://igit.58corp.com/58finance_fe_baseService_m/user_center.git'
// });
