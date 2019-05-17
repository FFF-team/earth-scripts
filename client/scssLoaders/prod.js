const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcss_loader = require('../../config/common/loaders/postcss');
const css_loader = require('../../config/common/loaders/css');
const style_loader = require('../../config/common/loaders/style');
const scss_loader = require('../../config/common/loaders/scss');

const _ = require('lodash');

// const mergeLoaders = require('../util').mergeLoaders;


function cssLoaders(customConfig) {


    // const base = {
    //     test: /\.css$/
    // };

    const loaderObj = {
        test: /\.scss$/,
        // fallback: style_loader
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: false
                }
            },
            css_loader({
                importLoaders: 1,
                sourceMap: false,
                import: true
            }),
            postcss_loader,
            scss_loader
        ],
    };


    // const getRets = (arr) => {
    //
    //     return arr.map((item) => {
    //
    //         const {use} = item;
    //         const others = _.omit(item, 'use');
    //
    //         // const {use, ..other} = item
    //
    //         return Object.assign(
    //             {},
    //             base,
    //             {
    //                 loader: ExtractTextPlugin.extract(
    //                     mergeLoaders(loaderObj)({
    //                         use: use
    //                     })
    //                 )
    //             },
    //             others
    //         )
    //     })
    //
    // };


    const normalLoader = () => {
        return [loaderObj]
    };

    // const cssModuleLoader = ({exclude, config}) => {
    //
    //     return exclude ?
    //         getRets([
    //             {
    //                 exclude: exclude,
    //                 use: [0,
    //                     css_loader(
    //                         Object.assign({
    //                             importLoaders: 1,
    //                             minimize: true,
    //                             sourceMap: true,
    //                             module: true,
    //                         }, config)
    //                     )
    //                 ]
    //             },
    //             {
    //                 include: exclude,
    //                 use: [0, css_loader({
    //                     importLoaders: 1,
    //                     minimize: true,
    //                     sourceMap: true,
    //                 })]
    //             }
    //         ]) :
    //         getRets([
    //             {
    //                 use: [0,
    //                     css_loader(
    //                         Object.assign({
    //                             importLoaders: 1,
    //                             minimize: true,
    //                             sourceMap: true,
    //                             module: true,
    //                         }, config)
    //                     )]
    //             }
    //         ])
    //
    // };


    const {
        exclude,
        config,
        enable
    } = customConfig.cssModule;

    return enable ?
        normalLoader() :
        // todo: 暂时不改造cssModule
        // cssModuleLoader({
        //     exclude,
        //     config
        // }) :
        normalLoader()

}

module.exports = cssLoaders;