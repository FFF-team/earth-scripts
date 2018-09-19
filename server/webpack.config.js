const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
const alias = require(path.resolve('config/alias'));
const nodeExternals = require('webpack-node-externals');
const customConfig = require('../config-user/webpack');
const imgLoaders = require('../config/imgLoaders/prod');


// const jsLoaders = require('earth-scripts/config/jsLoaders/dev');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

// TODO: 其他形式
const EARTH_SERVER_PATH = path.resolve(__dirname);
const CLIENT_PATH = path.resolve('src');


module.exports = {
    // The configuration for the server-side rendering
    name: "server-side rendering",
    entry: path.join(__dirname, "./index.js"),
    target: "node",
    output: {
        path: path.resolve("_server"),
        filename: "./dist/[name].generated.js",
        libraryTarget: "commonjs2",
        publicPath: '/',
    },
    // externals: /^[a-z\-0-9]+$/,
    externals: [
        nodeExternals({
            whitelist: [/^earth-scripts/]
        }),
        customConfig.externals
    ],
    node: {
        __dirname: false // 否则__dirname就会被webpack处理为'/'
    },
    resolve: {
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
        alias: Object.assign({
            window$: path.resolve(__dirname, 'fakeObject/window.js'),
            document$: path.resolve(__dirname, 'fakeObject/document'),

            // 指向根目录下package.json
            rootPackage: path.resolve('package.json'),
            // 指向client端代码
            clientSrc: path.resolve('src'),
            // 指向根目录_server
            rootServer: path.resolve('_server'),
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
                            /node_modules/,
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
        new webpack.ProvidePlugin({
            window : 'window',
            document: 'document'
        })
    ]
};
