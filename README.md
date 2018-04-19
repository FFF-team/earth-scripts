#### 扩展webpack配置

在项目下建立config/webpack.config.dev.js 或者 config/webpack.config.prod.js来修改默认webpack配置

例：

webpack.config.dev.js

```
module.exports = {
    // todo: 支持output, externals, plugins，其他的字段都会被忽略用默认的
    output: {
        // 注： 确保 publicPath 总是以斜杠(/)开头和结尾
        publicPath: '' // 作用参见webpack官方文档对publicPath的说明
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
        // 字符串形式。资源用统一的cdn路径。注：末尾需要加'/'
        publicPath: 'https://xxx.xxx.cdn/',
        // or 对象形式。不同资源用不同的cdn
        publicPath: {
            js: 'https://x1.xxx.cdn',
            css: 'https://x2.xxx.cdn',
            img: 'https://x3.xxx.cdn',
            media: 'https://x4.xxx.cdn'
        }
    }
    entry: {
        vendor: ['immutable'],
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
            root: "jQuery", // import jQuery from 'jquery'中的jQuery
            entry: { // cdn地址
                path: 'http://code.jquery.com/jquery-3.3.1.min.js',
                type: 'js',
            },
            files: ['index.html'] // 适用于哪个文件
        }
    },
    plugins: [
        // 可添加额外的plugins。如果添加的plugin在默认plugin里有，则会忽略
    ]
};

```

#### 使用.env

项目根目录下添加.env.development或.env.production文件

development环境下使用.env.development

production环境下使用.env.production

例：
```
HOST=3001 // 自定义端口号
ENABLE_BUNDLE_ANALYZE=true // 在npm run build后会启用js包分析工具

```

#### 自定义mock server

package.json增加字段:
```
"mockRoot":"server.js"
```

server.js为mock文件夹下自定义的mock server启动文件。如果不配置，则用默认的server

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

