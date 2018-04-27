const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const resolveApp = require('../tools').resolveApp;

// 兼容旧写法

/**
 * get custom config. webpack.config.[env].js
 * @param env  'dev' | 'prod'
 *
 * @return {object}
 */
function getCustomConfig(env) {
    const customConfigPath = path.resolve(`./config/webpack.config.${env}.js`);
    return fs.existsSync(customConfigPath) ? require(customConfigPath) : {}
}

/**
 * get filenames from config.output.filenames or config/filenames.js
 *
 * @param webpackConfig
 * {
 *      ...,
 *      output: {
 *          filenames: {
 *              js: 'static/js/[name].js',
 *              jsChunk: 'static/js/[name].chunk.js',
 *              css: '', // 在<style>中，无需配置
 *              img: 'static/img/[name].[hash:8].[ext]',
 *              media: 'static/media/[name].[hash:8].[ext]'
 *          }
 *
 *      },
 *      ...
 * }
 *
 * @return {object} filenames
 */
function getFilenames(webpackConfig) {

    let filenames = _.get(webpackConfig, ['output', 'filenames']);

    if (filenames && !_.isEmpty(filenames)) {
        return filenames
    }

    // deprecated
    log(chalk.yellow('\n config/filenames.js is deprecated, please use webpackconfig.output.filenames instead \n'));

    try {
        const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
        return require(path.resolve('config/filenames'))[env]
    } catch (e){

    }

    // show missing error
    if (_.isEmpty(filenames)) {
        console.log(chalk.red('webpackconfig.output.filenames is missing!'));
        process.exit(1);
    }

}

/**
 * get publicPath from config.output.publicPath or config/cndPath.js
 *
 * @param webpackConfig
 * {
 *      ...,
 *      output: {
 *          // string
 *          publicPath: 'path'
 *          // or obj (only prod)
 *          publicPath: {
 *            js: 'path',
 *            css: 'path',
 *            img: 'path',
 *            media: 'path'
 *          }
 *
 *      },
 *      ...
 * }
 *
 *
 * @return {*} publicPath [object | null]
 */
function getCdnPath(webpackConfig) {

    const defaultPublicPath = '.';
    const publicPath = _.get(webpackConfig, ['output', 'publicPath']);

    let cdnConfig = {};


    if (_.isPlainObject(publicPath)) {

        cdnConfig = publicPath;

        return {
            js: cdnConfig.js || defaultPublicPath,
            css: cdnConfig.css || defaultPublicPath,
            img: cdnConfig.img || defaultPublicPath,
            media: cdnConfig.media || defaultPublicPath
        }
    }

    if (_.isString(publicPath)) {
        return null
    }


    // deprecated
    log(chalk.yellow('\n config/cdnPath.js is deprecated, please use webpackconfig.output.publicPath instead \n'));
    try{
        cdnConfig = require(path.resolve('config/cdnPath'));
        return {
            js: cdnConfig.prodJsCDN || defaultPublicPath,
            css: cdnConfig.prodCssCDN || defaultPublicPath,
            img: cdnConfig.prodImgCDN || defaultPublicPath,
            media: cdnConfig.prodMediaCDN || defaultPublicPath
        }
    }catch(e){}

    // show missing error
    if (_.isEmpty(publicPath)) {
        log(chalk.red('webpackconfig.output.publicPath is missing!'));
        process.exit(1)
    }



}

/**
 * get alias from config.resolve.alias or config/alias.js
 *
 * @param webpackConfig
 * {
 *     ...,
 *     resolve: {
 *         alias: {
 *            // custom config
 *         }
 *     },
 *     ...
 * }
 *
 * @return {object} alias
 */
function getAliasConfig(webpackConfig) {
    let defaultConfig = {
        commons: path.resolve('src/components_common/'),
        tools: path.resolve('src/tools/'),
        api: path.resolve('src/api/'),
        config: path.resolve('src/config'),
        public: path.resolve('public/'),
        scss: path.resolve('src/scss_mixin/scss/'),
        scss_mixin: path.resolve('src/scss_mixin/'),
    };

    let alias = _.get(webpackConfig, ['resolve', 'alias']);

    if (_.isEmpty(alias)) {
        alias = defaultConfig;

        log(chalk.yellow('\n ' + "alias.js in config is deprecated. You can use alias in webpackconfig.resolve.alias." + '\n'));

        try{
            alias = require(path.resolve('config/alias'));
        }catch(e){
        }
    }


    return alias

}

/**
 * get cssModule from config.cssModule
 *
 * @param webpackConfig
 * {
 *     ...,
 *     cssModule: {
           exclude: 'src/static',
           name: '[name]__[local]-[hash:base64:5]'
       },
       ...
 * }
 *
 * @return {object}
 * {
 *     exclude: 'path',
 *     name: '',
 *     enable: false / true
 * }
 */
function getCssModuleConfig(webpackConfig) {
    let cssModule = _.get(webpackConfig, 'cssModule');

    if (_.isEmpty(cssModule)) {
        return {
            exclude: '',
            name: '',
            enable: false
        }
    }


    let excludePath;

    if (_.isArray(cssModule.exclude)) {
        excludePath = cssModule.exclude.map((path) => resolveApp(path))
        // fs.existsSync(resolveApp(cssModule.exclude)) ? resolveApp(cssModule.exclude) : ''
    } else {
        excludePath = resolveApp(cssModule.exclude)
    }

    return {
        exclude: excludePath,
        name: cssModule.name || '[name]__[local]-[hash:base64:5]',
        enable: true
    }
}


/**
 * 向loader中merge数据。
 * 注：针对use有特殊处理
 *
 * retLoaders(对象)(对象 | 数组对象)
 *
 * eg: retLoaders({a: '1'})({b: 's'}) -> {a: '1', b: 's'}
 *
 *     retLoaders(
 *        {a: '1', use: ['u1', 'u2']}
 *     )([
 *        {b: '2', use: [1, 'u3']} // use特殊处理，表示在index为1处插入'u3'
 *     ])
 *     ->
 *     [{a: '1', b: '1', use: ['u1', 'u3', 'u2']}]
 *
 *
 * @param original
 * @return {function(*): *} arr为对象则返回对象，arr为数组则返回数组
 */
function mergeLoaders(original) {
    return (arr) => {

        function merge(srcV, objV) {
            return _.mergeWith(srcV, objV, (a, b, key) => {
                if (_.isArray(b) && _.isArray(a) && key === 'use') {
                    const r = a.slice();
                    r.splice(b[0], 0, b[1]).valueOf();
                    return r
                }
            })
        }

        if (_.isArray(arr)) {
            return  arr.map((v) => merge(Object.assign({}, original), v))
        }

        return merge(Object.assign({}, original), arr)


    }
}

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

function log(msg) {
    console.log(msg)
}

module.exports = {
    getCustomConfig,
    getFilenames,
    getCdnPath,
    getAliasConfig,

    getCssModuleConfig,
    mergeLoaders,

    ensureSlash
};