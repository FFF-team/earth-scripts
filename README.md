### 注：
react v15.x 使用`earth-scripts@0.x`版本

react v16.x 使用`earth-scripts@1.x`版本 (webpack3、babel6、eslint5)

react ssr项目  使用`earth-scripts-ssr@0.x`版本

**重要更新**：

**`earth-scripts@3.x` 已升级至webpack4、babel7、eslint6**

**项目内如有webpack3插件或者eslint5相关配置，需要注意升级**

**原使用earth-scripts@1.x的项目升级至3.x版本时需要关注doc下的3.x升级指南**

### config
* polyfill.js
* webpack.config.dev.js
* webpack.config.prod.js


* alias.js `deprecated, webpackConfig.resolve.alias代替`
   ```
   module.exports = {
     moduleName: '/path-to-module/xx'
   }
   ```
* cdnPath.js  `deprecated, webpackConfig.output.publicPath代替`
   ```
   module.exports = {
     prodJsCDN: 'http://j1.cdn.com',
     prodCssCDN: 'http://c1.cdn.com',
     prodImgCDN: 'http://img1.cdn.com',
     prodMediaCDN: 'http://media1.cdn.com'
   }
   ```
* filenames.js  `deprecated, webpackConfig.output.publicPath代替`
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
    },
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
    // todo: 支持entry.vendor, output, plugins，其他的字段都会被忽略
    entry: {
        vendor: ['other modules']
    },
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
    },
    resolve: {
        alias: {...} // 同上
    },
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
HOST=3001 // 自定义端口号
BROWSER_ROUTER=true // 是否使用BrowserRouter

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

### dev环境下browserRouter优化

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
