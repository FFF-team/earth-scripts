const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');

// 兼容旧写法


function getFilenames(webpackConfig, filenamesConfig) {

    let filenames = _.get(webpackConfig, ['output', 'filenames']);

    if (filenames && !_.isEmpty(filenames)) {
        return filenames
    }

    // deprecated
    console.log(chalk.yellow('\n config/filenames.js is deprecated, please use webpackconfig.output.filenames instead \n'));

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
    console.log(chalk.yellow('\n config/cdnPath.js is deprecated, please use webpackconfig.output.publicPath instead \n'));
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
        console.log(chalk.red('webpackconfig.output.publicPath is missing!'));
        process.exit(1)
    }



}

function getAliasConfig() {
    let aliasConfig = {
        commons: path.resolve('src/components_common/'),
        tools: path.resolve('src/tools/'),
        api: path.resolve('src/api/'),
        config: path.resolve('src/config'),
        public: path.resolve('public/'),
        scss: path.resolve('src/scss_mixin/scss/'),
        scss_mixin: path.resolve('src/scss_mixin/'),
    };


    try{
        aliasConfig = require(path.resolve('config/alias'));
    }catch(e){
        console.log(chalk.yellow('\n' + "hi man, you should add alias.js in config" + '\n'));
    }


    return aliasConfig

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

module.exports = {
    getFilenames,
    getCdnPath,
    getAliasConfig,

    ensureSlash
};