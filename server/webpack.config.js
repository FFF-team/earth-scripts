const path = require("path");
const webpack = require('webpack');
const alias = require(path.resolve('config/alias'));
const nodeExternals = require('webpack-node-externals');
const customConfig = require('../config-user/webpack');
const imgLoaders = require('../config/imgLoaders/prod');
const ReactLoadablePlugin = require('react-loadable/webpack')
    .ReactLoadablePlugin;


// TODO: 其他形式
const EARTH_SERVER_PATH = path.resolve(__dirname);
const CLIENT_PATH = path.resolve('src');

const dev = process.env.NODE_ENV === 'development';


module.exports = {
    // The configuration for the server-side rendering
    name: "server-side rendering",
    // todo: entry是数组编译会有问题？？？？
    entry: {
        /*'main': [
            // "webpack/hot/poll?1000",
            require.resolve("./index.js")
        ]*/
        'main': require.resolve("./index.js")
    },
    devtool: dev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    target: "node",
    output: {
        path: path.resolve("_server/dist"),
        filename: "./[name].generated.js",
        libraryTarget: "commonjs2",
        chunkFilename: `[name].chunk.js`,
        publicPath: '/',
        hotUpdateChunkFilename: './[id].[hash].hot-update.js',
        hotUpdateMainFilename: './[hash].hot-update.json'
    },
    externals: [
        nodeExternals({
            whitelist: [
                // "webpack/hot/poll?1000",
                /^earth-scripts\/server/
            ]
        }),
        customConfig.externals
    ],
    node: {
        __dirname: false // 否则__dirname就会被webpack处理为'/'
    },
    resolve: {
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
        alias: Object.assign({
            'window$': path.resolve(__dirname, 'fakeObject/window.js'),
            'document$': path.resolve(__dirname, 'fakeObject/document'),

            // 指向根目录下package.json
            'rootPackage': path.resolve('package.json'),
            // 指向client端代码
            'clientSrc': path.resolve('src'),
            'clientBuild': path.resolve('build'),
            // 指向根目录_server
            'rootServer': path.resolve('_server'),
            'rootConfig': path.resolve('config'),
            'earth-scripts': path.resolve('node_modules/earth-scripts')
        }, alias)
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
                        exclude: [
                            /node_modules\/(?!earth-scripts)/
                        ],
                        include: [
                            EARTH_SERVER_PATH,
                            'rootServer',
                            CLIENT_PATH
                        ],
                        loader: require.resolve('babel-loader'),
                        // options: {
                        //     presets: [
                        //         ["env", {
                        //             "targets": {
                        //                 "node": "current"
                        //             }
                        //         }],
                        //         "react-app"
                        //     ],
                        // },
                    },
                    ...imgLoaders(customConfig),
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                    }
                    // {test: /\.png$/, loader: "url-loader"},
                    // {test: /\.jpg$/, loader: "file-loader"},
                ]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            window : 'window',
            document: 'document'
        }),
        // new ReactLoadablePlugin({ filename: './_server/dist/react-loadable.json', }),
    ]
};
