'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const webpackMerge = require('webpack-merge');
const _ = require('lodash');
const util = require('./util');

// import customerConfig
const customConfig = require('../config-user/webpack');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
    throw new Error('Production builds must have NODE_ENV=production.');
}

// import filenames config
const fileNames = customConfig.filenames;
// import cnd path
const cdnPaths = customConfig.cdnPath;
// import css filenames
const cssFilename = fileNames.css;


// media option
const mediaOption = cdnPaths && cdnPaths.media ?
    {
        name: fileNames.media,
        publicPath: util.ensureSlash(cdnPaths.media, true)
    } : {
        name: fileNames.media
    };

const htmlWebpackPluginMap = (function () {
    let map = [];
    for (let k in paths.entriesMap) {
        map.push(
            new HtmlWebpackPlugin({
                inject: true,
                flexibleStr: paths.flexibleStr,
                filename: `${k}.html`,
                template: paths.resolveApp(`public/${k}.html`),
                chunks: ['runtime', 'vendor', k],
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            })
        );
    }

    return map;

})();

paths.entriesMap['vendor'] = [
    require.resolve('./polyfills'),
    'react', 'react-dom', 'prop-types',
    'react-router-dom',
    'classnames'
];

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

function getSplitChunks() {
    let cacheGroups = {
        // 提取公共业务代码到default~AchunkName~BchunkName.js
        // default: false,
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
        },
        // 提取entry.vendor中配置的module到vendor
        vendor: {
            test: function(module, chunk) {

                const entryArr = Object.keys(paths.entriesMap || {}) || [];
                const vendorArr = paths.entriesMap.vendor || [];
                const allEntryRegexp = new RegExp(entryArr.join('|'));
                const allVendorRegexp = new RegExp(vendorArr.join('|'));

                for (const chunk of module.chunksIterable) {        //所有chunks的迭代
                    // 如果一个module在entry中用到，并且是node_modules包，这些包都会打包到vendor中
                    if (chunk.name && allEntryRegexp.test(chunk.name)) { //chunk的名称
                        // 把entry.vendor配置的module都打到vendor里
                        if (module.resource && allVendorRegexp.test(module.resource)) {
                            return true;
                        }
                    }
                }
                return false;

            },
            chunks: "all",
            minChunks: 1,
            priority: 10,
            name: "vendor",
            enforce: true
        },
        common: {
            name: "common",
            chunks: "initial",
            priority: 0,
            minChunks: 2
        }
    };
    // todo: 针对每个page提取出一个css文件。异步加载的文件会导出单独的css文件
    const allEntryArr = paths.allPages;
    allEntryArr.forEach((_entry) => {
        cacheGroups[`${_entry}-style`] = {
            name: `${_entry}`,
            test: (m, c, entry = `${_entry}`) =>
                m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true,
        }
    });
    return cacheGroups
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
const defaultConfig = {
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        comparisons: false,
                    },
                    output: {
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebookincubator/create-react-app/issues/2488
                        ascii_only: true,
                    },
                    ie8: false
                },
                sourceMap: shouldUseSourceMap,
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: getSplitChunks()
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: shouldUseSourceMap ? 'source-map' : false,
    // In production, we only want to load the polyfills and the app code.
    entry: paths.entriesMap,
    externals: {},
    output: {
        // The build folder.
        path: paths.appBuild,
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: fileNames.js,
        chunkFilename: fileNames.jsChunk,
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
            path
                .relative(paths.appSrc, info.absoluteResourcePath)
                .replace(/\\/g, '/'),
    },
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebookincubator/create-react-app/issues/253
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebookincubator/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.ts', '.tsx'],
        alias: customConfig.alias,
        plugins: [
            // Prevents users from importing files from outside of src/ (or node_modules/).
            // This often causes confusion because we only process files within src/ with babel.
            // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
            // please link the files into your node_modules/ and let module-resolution kick in.
            // Make sure your source files are compiled, as they will not be processed in any way.
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
            // Disable require.ensure as it's not a standard language feature.
            {parser: {requireEnsure: false}},

            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx|ts|tsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            eslintPath: require.resolve('eslint'),

                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: paths.appSrc,
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    // "url" loader works just like "file" loader but it also embeds
                    // assets smaller than specified size as data URLs to avoid requests.
                    ...require('./imgLoaders/prod')(customConfig),
                    // Process JS with Babel.
                    ...require('./jsLoaders/prod'),
                    // The notation here is somewhat confusing.
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader normally turns CSS into JS modules injecting <style>,
                    // but unlike in development configuration, we do something different.
                    // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
                    // (second argument), then grabs the result CSS and puts it into a
                    // separate file in our build process. This way we actually ship
                    // a single CSS file in production instead of JS code injecting <style>
                    // tags. If you use code splitting, however, any async bundles will still
                    // use the "style" loader inside the async code so CSS from them won't be
                    // in the main CSS file.
                    // css loader
                    ...require('./cssLoaders/prod')(customConfig),
                    //scss-loader
                    ...require('./scssLoaders/prod')(customConfig),
                    // "file" loader makes sure assets end up in the `build` folder.
                    // When you `import` an asset, you get its filename.
                    // This loader don't uses a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        loader: require.resolve('file-loader'),
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        options: mediaOption,
                    },
                    // ** STOP ** Are you adding a new loader?
                    // Make sure to add the new loader(s) before the "file" loader.
                ],
            },
        ],
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        ...htmlWebpackPluginMap,
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In production, it will be an empty string unless you specify "homepage"
        // in `package.json`, in which case it will be the pathname of that URL.
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        // cdn配置
        ...(cdnPaths ? [require('./common/cdnPathWebpackPlugin')(cdnPaths)] : []),


        // externals plugin
        ...require('./common/htmlWebpackExternalsPlugin')(customConfig.externals),
        // HashedModuleIdsPlugin
        new webpack.HashedModuleIdsPlugin(),
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),
        // 提取css
        new MiniCssExtractPlugin({
            filename: cssFilename,
            // allChunks: fileNames.cssChunk
        }),
        ...(process.env.ENABLE_BUNDLE_ANALYZE === 'true' ?
            [new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()] :
            []),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        // new ManifestPlugin({
        //   fileName: 'asset-manifest.json',
        // }),
        // Generate a service worker script that will precache, and keep up to date,
        // the HTML & assets that are part of the Webpack build.
        // new SWPrecacheWebpackPlugin({
        //   // By default, a cache-busting query parameter is appended to requests
        //   // used to populate the caches, to ensure the responses are fresh.
        //   // If a URL is already hashed by Webpack, then there is no concern
        //   // about it being stale, and the cache-busting can be skipped.
        //   dontCacheBustUrlsMatching: /\.\w{8}\./,
        //   filename: 'service-worker.js',
        //   logger(message) {
        //     if (message.indexOf('Total precache size is') === 0) {
        //       // This message occurs for every build and is a bit too noisy.
        //       return;
        //     }
        //     if (message.indexOf('Skipping static resource') === 0) {
        //       // This message obscures real errors so we ignore it.
        //       // https://github.com/facebookincubator/create-react-app/issues/2612
        //       return;
        //     }
        //     console.log(message);
        //   },
        //   minify: true,
        //   // For unknown URLs, fallback to the index page
        //   navigateFallback: publicUrl + '/index.html',
        //   // Ignores URLs starting from /__ (useful for Firebase):
        //   // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
        //   navigateFallbackWhitelist: [/^(?!\/__).*/],
        //   // Don't precache sourcemaps (they're large) and build asset manifest:
        //   staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        // }),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};

const newConfig = webpackMerge({

    customizeArray(a, b, key) {

        if (key === 'entry.vendor') {
            if (_.isArray(b)) {
                return _.uniq([...a, ...b])
            }
            return a
        }

        if (key === 'plugins') {
            let uniques = [
                'CdnPathWebpackPlugin',
                'InterpolateHtmlPlugin',
                'HtmlWebpackPlugin',
                'HtmlWebpackExternalsPlugin',
                'HashedModuleIdsPlugin',
                'DefinePlugin',
                'BundleAnalyzerPlugin'
            ];

            return [
                ...a,
                ..._.differenceWith(
                    b, a, plugin => uniques.indexOf(plugin.constructor && plugin.constructor.name) >= 0
                )
            ]
        }
        // Fall back to originalConfig
        return a;
    },
    customizeObject(a, b, key) {

        if (key === 'externals') {

            return customConfig.parseExternals(b)
        }

        if (key === 'output') {
            let newOutput = _.omit(b, 'filenames', 'publicPath');
            newOutput.publicPath = _.isString(b.publicPath) ? util.ensureSlash(b.publicPath, true) : publicPath;

            return _.merge(
                a,
                newOutput,
                {
                    filename: fileNames.js || b.filename,
                    chunkFilename: fileNames.jsChunk || b.chunkFilename
                }
            )
        }

        let frozenKeys = ['resolve', 'module', 'node', 'bail', 'devtool'];
        if (frozenKeys.indexOf(key) >= 0) {
            return a
        }

        // Fall back to default merging
        return undefined;
    }
})(defaultConfig, _.omit(customConfig.webpackConfig, 'cssModule'));

module.exports = newConfig;
