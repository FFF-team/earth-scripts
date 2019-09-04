const _ = require('lodash');
const HtmlWebpackExternalsPlugin = require('../../plugin/HtmlWebpackExternalsPlugin');
const paths = require('../paths');
/**
 * 处理externals对象
 *
 * @param externals
 * {
 *   echarts : {
            root: "echarts", // 指向全局变量,eg：可通过window.echart访问
            entry: { // cdn地址
                path: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.2/echarts.js',
                type: 'js',
            },
            files: ['index.html', 'test.html'] // 适用于哪个文件
     },
 * }
 *
 * @return {{}}
 * {
 *   file1: [{module: x, entry: {}}, {}],
 *   file2: [], ...
 * }
 */
const getExternalsByPage = function (externals) {
    if (!externals) {
        return {}
    }

    let htmlExternals = {};

    for (let key in externals) {
        if (externals.hasOwnProperty(key)) {
            externals[key].files &&
            externals[key].files.forEach((file) => {
                let pluginConfig = {
                    module: key,
                    entry: externals[key]['entry'],
                    global: externals[key]['root'] || null
                };
                if (htmlExternals[file] === undefined) {
                    htmlExternals[file] = [pluginConfig]
                } else {
                    htmlExternals[file].push(pluginConfig)
                }
            })
        }

    }

    return htmlExternals
};

/**
 * 为webpack-config添加externals功能，并添加对应的plugin
 * @param externals  customConfig.externals
 * @return {Array}  [plugins..]
 *
 * 传递给插件的参数
 * {
 *     externals: [
 *    {
 *      module: 'antd'，
 *      entry: {path: '', type: 'js'},
 *      global: 'antd'
 *    },
 *    {
 *      module: 'jquery'，
 *      entry: {path: '', type: 'js'},
 *      global: '$'
 *    }
 *   ],
 *   files: page
 * }
 */
const htmlWebpackExternalsPlugin = function (externals) {
    let externalsByPage = getExternalsByPage(externals);
    let plugins = [];

    for (let page in externalsByPage) {
        // 保证page有效性
        if (paths.entriesMap[page.replace(/(.html)$/, '')]) {
            plugins.push(
                // HtmlWebpackExternalsPlugin
                new HtmlWebpackExternalsPlugin({
                    externals: externalsByPage[page],
                    files: page
                })
            )
        }
    }

    return plugins
};

module.exports = htmlWebpackExternalsPlugin;
