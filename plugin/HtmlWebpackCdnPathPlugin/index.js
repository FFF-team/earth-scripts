const HtmlWebpackPlugin = require('html-webpack-plugin');

function CdnPathWebpackPlugin(options) {
    this.options = options;

    // js里面动态调用拼接的，根据 __webpack_public_path__ 来的
    this.runtimeCdnPath = options && options.runtimeCdnPath;

    // 构造生成html使用的资源
    this.assetsJsCdnPath = options && options.assetsJsCdnPath;
    this.assetsCssCdnPath = options && options.assetsCssCdnPath;

    if (
        (!this.runtimeCdnPath)
        || (!this.assetsJsCdnPath)
        || (!this.assetsCssCdnPath)
    ) {
        throw new Error('runtimeCdnPath,assetsJsCdnPath,assetsCssCdnPath must not be empty')
    }
}

CdnPathWebpackPlugin.asString = function(str) {
    if (Array.isArray(str)) {
        return str.join("\n");
    }
    return str;
};

CdnPathWebpackPlugin.prototype.apply = function (compiler) {
    var self = this;
    const publicPath = (() => {
        if (this.publicPath != null) {
            return this.publicPath
        } else if (compiler.options.output.publicPath != null) {
            return compiler.options.output.publicPath
        } else {
            return ''
        }
    })();

    compiler.hooks.compilation.tap('CdnPathWebpackPlugin', function (compilation) {

        HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
            'myplugin',
            (htmlPluginData, cb) => {

                if (self.assetsJsCdnPath) {

                    htmlPluginData.assets.js = htmlPluginData.assets.js.map(function (item) {
                        return self.assetsJsCdnPath + item
                    })
                }

                if (self.assetsCssCdnPath) {
                    htmlPluginData.assets.css = htmlPluginData.assets.css.map(function (item) {
                        return self.assetsCssCdnPath + item
                    })
                }

                cb(null, htmlPluginData)
            }
        );



        // 修改__webpack_require__.p 指向的地址
        // 参考 https://github.com/webpack/webpack/blob/master/lib/MainTemplate.js//
        if (self.runtimeCdnPath) {

            const webpackMainTemplate = compilation.mainTemplate;

            const requireFn = webpackMainTemplate.requireFn;

            webpackMainTemplate.hooks.requireExtensions.tap("CdnPathWebpackPlugin-mainTemplate", function (source, module, hash) {
                const runtimePublicPath = `'${self.runtimeCdnPath}${publicPath}'`;
                const buf = [];
                buf.push(source);
                buf.push('');
                buf.push('// publicPath override (html-webpack-cdn-path-plugin)');
                buf.push(requireFn + '.p = (' + runtimePublicPath + ') || ' + requireFn + '.p;');
                return CdnPathWebpackPlugin.asString(buf)

            })

        }

    })

};

module.exports = CdnPathWebpackPlugin;
