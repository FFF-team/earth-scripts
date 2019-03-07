const path = require("path");
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const customConfig = require('../config-user/webpack');
const imgLoaders = require('../config/imgLoaders/prod');


const CLIENT_PATH = path.resolve('src');

const dev = process.env.NODE_ENV === 'development';

module.exports = {
    // The configuration for the server-side rendering
    name: "server-side rendering",
    // todo: entry是数组编译会有问题？？？？
    // entry: {
    //     /*'main': [
    //         // "webpack/hot/poll?1000",
    //         require.resolve("./index.js")
    //     ]*/
    //     'main': path.resolve('node_modules/react-ssr-with-koa/src/index.js')
    // },
    devtool: dev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    target: "node",
    output: {
        path: path.resolve("build/server"),
        filename: "./[name].generated.js",
        libraryTarget: "commonjs2",
        chunkFilename: `[name].chunk.js`,
        publicPath: dev ? customConfig.staticPath.js : '/',
        hotUpdateChunkFilename: './[id].[hash].hot-update.js',
        hotUpdateMainFilename: './[hash].hot-update.json'
    },
    externals: [
        nodeExternals({
            whitelist: [
                // "webpack/hot/poll?1000"
            ]
        })
    ],
    node: {
        __dirname: false // 否则__dirname就会被webpack处理为'/'
    },
    resolve: {
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
        alias: customConfig.alias
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                // CSS 代码不能被打包进用于服务端的代码中去，忽略掉 CSS 文件
                oneOf: [
                    {test: /\.css$/, loader: "ignore-loader"},
                    {test: /\.scss$/, loader: "ignore-loader"},
                    {
                        test: /\.(js|jsx)$/,
                        include: [
                            CLIENT_PATH
                        ],
                        loader: require.resolve('babel-loader'),
                    },
                    ...imgLoaders(customConfig),
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: customConfig.filenames.media,
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "IS_SERVER": "true",  // 标识正在使用ssr
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV) // node环境
            }
        }),
    ]
};
