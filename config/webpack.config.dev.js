'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const webpackMerge = require('webpack-merge');
const _ = require('lodash');
const util = require('./util');

// import customerConfig
const customConfig = require('../config-user/webpack');


// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// import filenames config
const fileNames = customConfig.filenames;

const htmlWebpackPluginMap = (function(){
    let map = [];
    for(let k in paths.entriesMap){
        paths.entriesMap[k] = [
            require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.entriesMap[k]
        ];
        map.push(
            new HtmlWebpackPlugin({
                inject: true,
                flexibleStr: paths.flexibleStr,
                filename: `${k}.html`,
                template: paths.resolveApp(`public/${k}.html`),
                chunks: ['runtime', 'vendor', k]
            })
        );
    }
    return map;
})();

paths.entriesMap['vendor'] = [
    require.resolve('./polyfills'),
    require.resolve('react-error-overlay'),
];


// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
const defaultConfig =  {
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: 'cheap-module-source-map',
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    // The first two entry points enable "hot" CSS and auto-refreshes for JS.
    entry: paths.entriesMap,
    externals: customConfig.externals,
    output: {
        // Next line is not used in dev but WebpackDevServer crashes without it:
        path: paths.appBuild,
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: fileNames.js,
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: fileNames.jsChunk,
        // This is the URL that app is served from. We use "/" in development.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
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
            // TODO: Disable require.ensure as it's not a standard language feature.
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },

            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx)$/,
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
                    // "url" loader works like "file" loader except that it embeds assets
                    // smaller than specified limit in bytes as data URLs to avoid requests.
                    // A missing `test` is equivalent to a match.
                    ...require('./imgLoaders/dev')(customConfig),
                    // Process JS with Babel.
                    ...require('./jsLoaders/dev')(),
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader turns CSS into JS modules that inject <style> tags.
                    // In production, we use a plugin to extract that CSS to a file, but
                    // in development "style" loader enables hot editing of CSS.
                    ...require('./cssLoaders/dev')(customConfig),
                    // sass-loader
                    ...require('./scssLoaders/dev')(customConfig),
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader don't uses a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: fileNames.media,
                        },
                    },
                ],
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
        ],
    },
    plugins: [
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In development, this will be an empty string.
        new InterpolateHtmlPlugin(env.raw),
        // Generates an `index.html` file with the <script> injected.
        ...htmlWebpackPluginMap,
        // HtmlWebpackExternalsPlugin
        ...require('./common/htmlWebpackExternalsPlugin')(customConfig._origin.externals),

        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "runtime"
        }),

        // Add module names to factory functions so they appear in browser profiler.
        new webpack.NamedModulesPlugin(),
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
        new webpack.DefinePlugin(env.stringified),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebookincubator/create-react-app/issues/186
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
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
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false,
    },
};

const newConfig = webpackMerge({

    customizeArray(a, b, key) {

        if (key === 'plugins') {
            let uniques = [
                'InterpolateHtmlPlugin',
                'HtmlWebpackPlugin',
                'HtmlWebpackExternalsPlugin',
                'CommonsChunkPlugin',
                'NamedModulesPlugin',
                'DefinePlugin',
                'HotModuleReplacementPlugin',
                'CaseSensitivePathsPlugin',
                'WatchMissingNodeModulesPlugin'
            ];
            return [
                ...a,
                ..._.differenceWith(
                    b, a, plugin => uniques.indexOf(plugin.constructor && plugin.constructor.name) >= 0
                )
            ]
        }
        // Fall back to default merge
        return undefined;
    },
    customizeObject(a, b, key) {

        if (key === 'output') {
            return _.merge(
                a,
                _.omit(b, 'filenames'),
                {
                    filename: fileNames.js || b.filename,
                    chunkFilename: fileNames.jsChunk || b.chunkFilename,
                    publicPath: b.publicPath ? util.ensureSlash(b.publicPath, true) : publicPath
                }
            )
        }

        let frozenKeys = ['resolve', 'entry', 'module', 'node', 'performance', 'externals'];
        if (frozenKeys.indexOf(key) >= 0) {
            return a
        }

        // Fall back to default merge
        return undefined;
    }
})(defaultConfig, customConfig._origin);

module.exports = newConfig;