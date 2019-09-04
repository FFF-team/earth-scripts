/**
 * {
 *     externals: [{
 *         module: 'lodash',
 *         entry: {
 *             path: 'http://cdn.cn/a.js',
 *             type: 'js'
 *         },
 *         global: _
 *     }],
 *     files: ["a.html"]
 * }
 *
 * @param config
 * @constructor
 */

const CopyWebpackPlugin = require('copy-webpack-plugin')
const Ajv = require('ajv');
const configSchema = require('./configSchema.json')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-tags-plugin');

HtmlWebpackExternalsPlugin.validateArguments = (() => {
    const ajv = new Ajv({ useDefaults: true, removeAdditional: true });
    const validateConfig = ajv.compile(configSchema);

    return config => {
        if (!validateConfig(config)) {
            throw new TypeError(ajv.errorsText(validateConfig.errors))
        }
    }
})();

HtmlWebpackExternalsPlugin.URL_ENTRY = /^(http:|https:)?\/\//;



function HtmlWebpackExternalsPlugin(config) {

    HtmlWebpackExternalsPlugin.validateArguments(config);


    // webpack config 里的externals，两种格式
    // ['react', 'react-dom']
    // [{"react": "react", 'reactDom': 'react-dom'}]
    this.externals = []; // webpack config用的externals配置
    this.assetsToCopy = [];
    this.assetsToAppend = [];
    this.assetsToPrepend = [];


    const { externals, hash, outputPath, publicPath, files, enabled, cwpOptions } = config
    this.hash = hash;
    this.outputPath = outputPath;
    this.publicPath = publicPath;
    this.files = files;
    this.enabled = enabled;
    this.cwpOptions = cwpOptions;

    // 初始化externals
    externals.forEach(({ module, entry, global, supplements, append }) => {

        if (global) {
            this.externals.push(global ? { [module]: global } : module);
        }

        const localEntries = [];

        const entries = (Array.isArray(entry) ? entry : [entry]).map(entry => {
            if (typeof entry === 'string') {
                entry = { path: entry, type: undefined }
            }
            if (HtmlWebpackExternalsPlugin.URL_ENTRY.test(entry.path)) {
                return entry
            }

            const result = { ...entry, path: `${module}/${entry.path}` };
            localEntries.push(result);
            return result
        });


        if (append) {
            this.assetsToAppend = [...this.assetsToAppend, ...entries]
        } else {
            this.assetsToPrepend = [...this.assetsToPrepend, ...entries]
        }

        this.assetsToCopy = [
            ...this.assetsToCopy,
            ...localEntries,
            ...supplements.map(asset =>
                typeof asset === 'string'
                    ? { path: `${module}/${asset}`, cwpPatternConfig: {} }
                    : { ...asset, path: `${module}/${asset.path}` }
            ),
        ]
    });

}


HtmlWebpackExternalsPlugin.prototype.apply = function (compiler) {
    if (!this.enabled) {
        return
    }


    if (!compiler.options.externals) {
        compiler.options.externals = this.externals
    } else if (Array.isArray(compiler.options.externals)) {
        compiler.options.externals = [...compiler.options.externals, ...this.externals]
    } else {
        compiler.options.externals = [compiler.options.externals, ...this.externals]
    }


    const publicPath = (() => {
        if (this.publicPath != null) {
            return this.publicPath
        } else if (compiler.options.output.publicPath != null) {
            return compiler.options.output.publicPath
        } else {
            return ''
        }
    })();

    const pluginsToApply = [];

    pluginsToApply.push(
        new CopyWebpackPlugin(
            this.assetsToCopy.map(({ path, cwpPatternConfig }) => ({
                from: path,
                to: `${this.outputPath}/${path}`,
                ...cwpPatternConfig,
            })),
            this.cwpOptions
        )
    );


    const createAssetsPlugin = (assets, append) => {
        if (assets.length) {
            pluginsToApply.push(
                new HtmlWebpackIncludeAssetsPlugin({
                    tags: assets.map(
                        asset =>
                            HtmlWebpackExternalsPlugin.URL_ENTRY.test(asset.path)
                                ? asset
                                : {
                                    ...asset,
                                    path: `${publicPath}${this.outputPath}/${asset.path}`,
                                }
                    ),
                    append,
                    hash: this.hash,
                    files: this.files == null ? undefined : this.files,
                    publicPath: '',
                })
            )
        }
    };

    createAssetsPlugin(this.assetsToPrepend, false);
    createAssetsPlugin(this.assetsToAppend, true);


    pluginsToApply.forEach(plugin => plugin.apply(compiler))

};

module.exports = HtmlWebpackExternalsPlugin;
