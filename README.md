### 注：
react v15.x 使用`earth-scripts@0.x`版本

react v16.x 使用`earth-scripts@1.x`版本

react-ssr 使用`earth-scripts@2.x`版本

### config

---

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

---

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
        echarts : "echarts"  // 指向全局变量,
        jquery: "jQuery" // 暴露给window的变量，例window.jQuery。 使用：import jQuery from 'jquery'
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
        echarts : "echarts"  // 指向全局变量,
        jquery: "jQuery" // 暴露给window的变量，例window.jQuery。 使用：import jQuery from 'jquery'
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

---

项目根目录下添加.env.development或.env.production文件

development环境下使用.env.development

production环境下使用.env.production

例：
```
dev环境下配置：
CLIENT_PORT=3001 // 自定义开发环境webpack-dev-server端口号

prod环境下配置：
ENABLE_BUNDLE_ANALYZE=true // 在npm run build后会启用js包分析工具

```


### mock server

---

npm run start在"proxy"的地址是localhost、127.0.0.1、本机ip时会启动mockserver，port为配置的端口号。
否则不会在本机启动mock server

```
”proxy”: “http://localhost:3001/“
```

##### 自定义mock server

package.json增加字段:
```
"mockRoot":"server.js"
```

server.js为mock文件夹下自定义的mock server启动文件。如果不配置，则用默认的server

可通过 **npm run start -- stopmock**在dev环境下不启用mock


### ssr

---


##### config/ssr.js

配置server端react入口文件。具体内容可参见[react-ssr-with-react](https://github.com/kanghongyan/react-ssr-with-koa)

```
const path = require('path');
module.exports = {
    appEntry: {
        "page1": path.resolve('src/pages/page1/indexSSR.js'),
        "page2": path.resolve('src/pages/page2/indexSSR.js')
    },
};
```


##### CLI

* development

  `earth-scripts start` 启动client端
  
       执行如下步骤：
           * 打包编译client端代码、启动webpackDevServer(CLIENT_PORT)、启动mockserver
           * 生成asset-manifest.json react-loadable.json

  `earth-scripts ssr-start --entry=pathToEntry.js` 启动server端
  
      执行如下步骤：
         * 清空build/server下原有内容
         * webpack(watch) 打包编译config/ssr.js里配置的appEntry文件。生成到build/server下
         * nodemon执行pathToEntry.js文件。当build/server下文件有改动，则重启
  

* production

  `earth-scripts ssr-deploy --entry=pathToEntry.js --env=production`
  
      执行如下步骤：
           * 清空build/server下原有内容
           * webpack打包编译config/ssr.js里配置的appEntry文件。生成到build/server下
           * pm2执行pathToEntry.js文件。
  

*如果不加entry参数，则不会启动server，需要自己手动启动*
  
  `earth-scripts ssr-start && node pathToEntry.js`


###### build目录结构


```
build/
  - server/              // react build for server
  - static/              // react build for client
  - asset-manifest.json  // static files map for server
  - react-loadable.json  // loadable files map for server


```
### .babelrc 替换为 .babel.js

方便根据process.env变量添加不同环境需要的babel配置


---

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