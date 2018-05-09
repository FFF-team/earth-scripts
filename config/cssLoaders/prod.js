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
            })]
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

    const cssModuleLoader = ({exclude, config}) => {

        return exclude ?
            getRets([
                {
                    exclude: exclude,
                    use: [0,
                        css_loader(
                            Object.assign({
                                importLoaders: 1,
                                minimize: true,
                                sourceMap: false,
                                module: true,
                                // sourceMap: shouldUseSourceMap,
                            }, config)
                        )
                    ]
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
                        css_loader(
                            Object.assign({
                                importLoaders: 1,
                                minimize: true,
                                sourceMap: false,
                                module: true,
                                // sourceMap: shouldUseSourceMap,
                            }, config)
                        )]
                }
            ])

    };


    const {
        exclude,
        config,
        enable
    } = cssModuleConfig(customConfig);

    return enable ?
        cssModuleLoader({
            exclude,
            config
        }) :
        normalLoader()

}

module.exports = cssLoaders;