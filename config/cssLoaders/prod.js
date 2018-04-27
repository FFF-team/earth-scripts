const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const style_loader = require('../common/loaders/style');

const _ = require('lodash');

const mergeLoaders = require('../util').mergeLoaders;

const cssModuleConfig = require('../util').getCssModuleConfig;




function cssLoaders(customConfig, extractTextPluginOptions) {


    const base = {
        test: /\.css$/
    };

    const loaderObj = Object.assign(
        {
            fallback: style_loader,
            use: [
                postcss_loader,
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
                base,
                {
                    loader: ExtractTextPlugin.extract(
                        mergeLoaders(loaderObj)({
                            use: use
                        })
                    )
                },
                others
            )
        })

    };


    const normalLoader = () => {
        return getRets([{
            use: [0 , css_loader({
                importLoaders: 1,
                minimize: true,
                sourceMap: false,
                // sourceMap: shouldUseSourceMap,
            }),]
        }])
        /*return [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 1,
                                    minimize: true,
                                    sourceMap: false,
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
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
                        importLoaders: 1,
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
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: false,
                        // sourceMap: shouldUseSourceMap,
                    })]
                }
            ]) :
            getRets([
                {
                    use: [0,
                        css_loader({
                            importLoaders: 1,
                            minimize: true,
                            sourceMap: false,
                            module: true,
                            localIdentName: name
                            // sourceMap: shouldUseSourceMap,
                        }),]
                }
            ])

        /*return exclude ? [
            {
                test: /\.css$/,
                exclude: exclude,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 1,
                                    minimize: true,
                                    sourceMap: false,
                                    module: true,
                                    localIdentName: name
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            },
            {
                test: /\.css$/,
                include: exclude,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 1,
                                    minimize: true,
                                    sourceMap: false,
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ] : [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: style_loader,
                            use: [
                                css_loader({
                                    importLoaders: 1,
                                    minimize: true,
                                    sourceMap: false,
                                    module: true,
                                    localIdentName: name
                                    // sourceMap: shouldUseSourceMap,
                                }),
                                postcss_loader,
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

module.exports = cssLoaders;