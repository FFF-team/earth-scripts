const CdnPathWebpackPlugin = require("html-webpack-cdn-path-plugin");

const cdnPathWebpackPlugin = (cdnPaths) => {

    return new CdnPathWebpackPlugin({
        runtimeCdnPath: [cdnPaths.js], // js动态生成<script src='xxxx'>
        assetsJsCdnPath: [cdnPaths.js], // html js路径替换
        assetsCssCdnPath: [cdnPaths.css], // html css路径替换
    })
};

module.exports = cdnPathWebpackPlugin;