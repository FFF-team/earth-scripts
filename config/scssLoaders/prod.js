const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const style_loader = require('../common/loaders/style');
const scss_loader = require('../common/loaders/scss');
const _ = require('lodash');

const mergeLoaders = require('../util').mergeLoaders;

const cssModuleConfig = require('../util').getCssModuleConfig;



function scssLoaders(customConfig, extractTextPluginOptions) {

    const base = {
        test: /\.scss$/,
    };

    const loaderObj = Object.assign(
        {
            fallback: style_loader,
            use: [
                postcss_loader,
                scss_loader
            ],
        },
        extractTextPluginOptions
    );

    const getRets = (arr) => {

        return arr.map((item) => {

            const {use} = item;
            const others = _.omit(item, 'use');

            // const {use, ..other} = item

            return Object.assign(
                {},
                others,
                base,
                {
                    loader: ExtractTextPlugin.extract(
                        mergeLoaders(loaderObj)({
                            use: use
                        })
                    )
                },
            )
        })


    }


    const normalLoader = () => {

        return getRets([{
            use: [0 , css_loader({
                importLoaders: 2,
                minimize: true,
                sourceMap: false,
                // sourceMap: shouldUseSourceMap,
            }),]
        }])

        /*return [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 2,
                                    minimize: true,
                                    sourceMap: false,
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
                                scss_loader
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ]*/
    };

    const cssModuleLoader = ({exclude, name}) => {

        return exclude ?
            getRets([
                {
                    exclude: exclude,
                    use: [0, css_loader({
                        importLoaders: 2,
                        minimize: true,
                        sourceMap: false,
                        module: true,
                        localIdentName: name
                        // sourceMap: shouldUseSourceMap,
                    })]
                },
                {
                    include: exclude,
                    use: [0, css_loader({
                        importLoaders: 2,
                        minimize: true,
                        sourceMap: false,
                        // sourceMap: shouldUseSourceMap,
                    })]
                }
            ]) :
            getRets([
                {
                    use: [0, css_loader({
                        importLoaders: 2,
                        minimize: true,
                        sourceMap: false,
                        module: true,
                        localIdentName: name
                        // sourceMap: shouldUseSourceMap,
                    })]
                }
            ])

        /*return exclude ? [
            {
                test: /\.scss$/,
                exclude: exclude,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 2,
                                    minimize: true,
                                    sourceMap: false,
                                    module: true,
                                    localIdentName: name
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
                                scss_loader
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            },
            {
                test: /\.scss$/,
                include: exclude,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 2,
                                    minimize: true,
                                    sourceMap: false,
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
                                scss_loader
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ] : [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 2,
                                    minimize: true,
                                    sourceMap: false,
                                    module: true,
                                    localIdentName: name
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
                                scss_loader
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ]*/
    };




    const {
        exclude,
        name,
        enable
    } = cssModuleConfig(customConfig);

    return enable ?
        cssModuleLoader({
            exclude,
            name
        }) :
        normalLoader()


}

module.exports = scssLoaders;