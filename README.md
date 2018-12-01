### 注：
react v15.x 使用`earth-scripts@0.x`版本

react v16.x 使用`earth-scripts@1.x`版本

### config
* polyfill.js
* webpack.config.dev.js `优先级高于但文件配置`
* webpack.config.prod.js  `优先级高于但文件配置`


* alias.js `deprecated, 对应webpackConfig.resolve.alias`
   ```
   module.exports = {
     moduleName: '/path-to-module/xx'
   }
   ```

* staticPath `静态资源路径，对应webpackConfig.output.publicPath`
   ```
   module.exports = {
       dev: 'http://localhost:3100/',
       prod: {
           js: '//j1.58cdn.com.cn/jinrong/user_center/',
           css: '//j1.58cdn.com.cn/jinrong/user_center/',
           img: '//j1.58cdn.com.cn/jinrong/user_center/',
           media: '//j1.58cdn.com.cn/jinrong/user_center/'
       }
   }
   ```
* filenames.js  `deprecated, 对应webpackConfig.output.publicPath`
   ```
   module.exports = {
     dev: {
          js: 'static/js/[name].js',
          jsChunk: 'static/js/[name].chunk.js',
          css: '', // 在<style>中，无需配置
          img: 'static/img/[name].[hash:8].[ext]',
          media: 'static/media/[name].[hash:8].[ext]'
     },
     prod: {
         js: `static/js/[name].[chunkhash:8].js`,
         jsChunk: `static/js/[name].[chunkhash:8].chunk.js`,
         css: `static/css/[name].[chunkhash:8].css`,
         img: `static/img/[name].[chunkhash:8].[ext]`,
         media: `static/media/[name].[chunkhash:8].[ext]`
     }
   }
   ```

### 扩展webpack配置

在项目下建立config/webpack.config.dev.js 或者 config/webpack.config.prod.js来修改默认webpack配置

例：

webpack.config.dev.js

```
module.exports = {
    // todo: 支持output, externals, plugins，其他的字段都会被忽略用默认的
    output: {
        // 注： 确保 publicPath 总是以斜杠(/)开头和结尾
        publicPath: '/abc/',
        // 将原来的config/filenames.js配置到这里
        filenames: {
            js: 'static/js/[name].js',
            jsChunk: 'static/js/[name].chunk.js',
            css: '', // 在<style>中，无需配置
            img: 'static/img/[name].[hash:8].[ext]',
            media: 'static/media/[name].[hash:8].[ext]'
        }
    },
    resolve: {
        alias: {...}
    }
    externals: {
        echarts : {
            root: "echarts", // 指向全局变量
            entry: { // cdn地址
                path: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.2/echarts.js',
                type: 'js',
            },
            files: ['index.html', 'test.html'] // 适用于哪个文件
        },
        jquery: {
            root: "jQuery", // 暴露给window的变量，例window.jQuery。 使用：import jQuery from 'jquery'
            entry: { // cdn地址
                path: 'http://code.jquery.com/jquery-3.3.1.min.js',
                type: 'js',
            },
            files: ['index.html'] // 适用于哪个文件
        }
    },
    cssModule: {
        exclude: ['node_modules,', 'src/static'] // 不需要css module的文件
        localIdentName: '[name]__[local]-[hash:base64:5]' // class命名方式
    },
    plugins: [
        // 可添加额外的plugins。如果添加的plugin在默认plugin里有，则会忽略
    ]
};



```

webpack.config.prod.js

```
module.exports = {
    // todo: 支持output，entry.vendor, plugins，其他的字段都会被忽略
    output: {
        // 字符串形式。
        // 资源用统一的cdn路径。
        publicPath: 'https://xxx.xxx.cdn',
        // or 对象形式。不同资源用不同的cdn
        // publicPath: {
        //    js: 'https://x1.xxx.cdn',
        //    css: 'https://x2.xxx.cdn',
        //    img: 'https://x3.xxx.cdn',
        //    media: 'https://x4.xxx.cdn'
        // }，
        // 将原来的config/filenames.js配置到这里
        filenames: {
             js: 'static/js/[name].js',
             jsChunk: 'static/js/[name].chunk.js',
             css: '', // 在<style>中，无需配置
             img: 'static/img/[name].[hash:8].[ext]',
             media: 'static/media/[name].[hash:8].[ext]'
        }
    }
    entry: {
        vendor: ['immutable'],
    },
    resolve: {
        alias: {...} // 同上
    }
    externals: {
        echarts : {
            root: "echarts", // 指向全局变量
            entry: { // cdn地址
                path: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.2/echarts.js',
                type: 'js',
            },
            files: ['index.html', 'test.html'] // 适用于哪个文件
        },
        jquery: {
            root: "jQuery", // 暴露给window的变量，例window.jQuery。 使用：import jQuery from 'jquery'
            entry: { // cdn地址
                path: 'http://code.jquery.com/jquery-3.3.1.min.js',
                type: 'js',
            },
            files: ['index.html'] // 适用于哪个文件
        }
    },
    cssModule: {} // 同上
    plugins: [
        // 可添加额外的plugins。如果添加的plugin在默认plugin里有，则会忽略
    ]
};

```

##### 相关资料

 * css module
    * [css module](https://github.com/css-modules/css-modules)

    * [CSS Modules 详解及 React 中实践](https://github.com/camsong/blog/issues/5)

 * [webpack alias](https://webpack.js.org/configuration/resolve/#resolve-alias)

 * [webpack publicPath](https://webpack.js.org/guides/public-path/)

### 使用.env

项目根目录下添加.env.development或.env.production文件

development环境下使用.env.development

production环境下使用.env.production

例：
```
dev环境下配置：
HOST=3001 // 自定义开发环境webpack-dev-server端口号

prod环境下配置：
ENABLE_BUNDLE_ANALYZE=true // 在npm run build后会启用js包分析工具

```

### mock server

npm run start在"proxy"的地址是localhost、127.0.0.1、本机ip时会启动mockserver，port为配置的端口号。
否则不会在本机启动mock server

```
”proxy”: “http://localhost:3001/“
```

### 自定义mock server

package.json增加字段:
```
"mockRoot":"server.js"
```

server.js为mock文件夹下自定义的mock server启动文件。如果不配置，则用默认的server

可通过 **npm run start -- stopmock**在dev环境下不启用mock


### node server

* development

  `earth-scripts ssr-start` 启动server端

  `earth-scripts start -- server` 启动client端

* test

  `earth-scripts ssr-deploy --env=test`

* production

  `earth-scripts ssr-deploy --env=production`

###### 目录结构


```
_server/
  - assets/ 存放资源json文件
  - dist/  编译后的文件
  - log/   日志文件（dev环境下位置，部署后会到/opt/nodejslogs下）
  - proxy_[name] 定义代理的接口前缀及逻辑。eg: 需要代理的地址如下，/api/user/center，有统一的前缀
                 api，则目录为proxy_api
    - index.js   提供两个方法可供自定义 apiProxyBefore(ctx), apiProxyReceived(ctx)

  - page/     page对应的逻辑


```


tip:

在启动命令中自定义启动文件：

`earth-scripts ssr-start --entry=_server/app.js`


```
_server/app.js

const start = require('earth-scripts/server/app');
const env = require('../config/server');
const http = require('http');

const port = env.port;



sstart().then((app) => {


     const appCallback = app.callback();
     const server = http.createServer(appCallback);

     // 可以添加自己项目的逻辑
     // app.use(xxx)

     server
         .listen(port)
         .on('clientError', (err, socket) => {
             // handleErr(err, 'caught_by_koa_on_client_error');
             socket.end('HTTP/1.1 400 Bad Request Request invalid\r\n\r\n');
         });


     console.log(`custom Server client running on: http://localhost: ${port}`);
 });

```




需要代理的api，可实现如下两个函数：

```
proxy_api/index.js

module.exports = {
   // 代理之前
   apiProxyBefore: (ctx) => {
      // 自定义代理域名
      ctx.app_proxyServer = 'http://test001.payment.58v5.cn';
      // 为true可以拿到代理接口的response,可在apiProxyReceived中做进一步处理
      ctx.app_selfHandleResponseApi = true
   }，
   // 代理后
   apiProxyReceived: (req, res) => {
      res._app_proxy = (data, send) => {
         // 可修改返回值 data object, 最后调用send
         send(Object.assign(data, {notice: 111})

      }
   }
}


```

page文件夹下可创建某一page的js，自定义是否使用ssr(默认都不使用)

```
page/page1.js

router.get('/', async (ctx, next) => {

    const htmlObj = await new html(ctx, PAGE)
        .init({
            ssr: true,
            browserRouter: true,
            app: App
        }).catch((e) => {
                console.log(e);
                console.log('page get file error')
            }
        );

    // 有redux情况下，每次请求都必须createStore
    htmlObj.injectStore(createStore(reducers, {})).render();
});
```
todo: more
todo: 优化





----

###### (废弃)cdnPath.js废弃

###### (废弃)dev环境下browserRouter优化

.env.development配置BROWSER_ROUTER=true // 是否使用BrowserRouter

page.html在url上会转化为page

例:
```
http://localhost:3000/index.html/[browerRouter内容]
```

 会转化为

 ```
 http://localhost:3000/index/[browerRouter内容]
 ```

需要在Router配置中加basename： publicPath(如果设置) + pageName
```

// publicPath： '/abc/'
// 当前pagename： 'pay.html'

<Router basename='/abc/pay'>
  ....
</Router>

```
.env.development添加配置：

```
BROWSER_ROUTER=true
```