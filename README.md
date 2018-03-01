#### 扩展webpack配置

在项目下建立config/webpack.config.dev.js 或者 config/webpack.config.prod.js来修改默认webpack配置

例：

webpack.config.dev.js

```
module.exports = {
    // todo: 只支持externals, plugins，其他的字段都会被忽略用默认的
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

webpack.config.prod.js

```
module.exports = {
    // todo: 只支持entry.vendor, plugins，其他的字段都会被忽略
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