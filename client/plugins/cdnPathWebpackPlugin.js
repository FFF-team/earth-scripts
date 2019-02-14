const CdnPathWebpackPlugin = require("html-webpack-cdn-path-plugin");
const ensureSlash = require('../../tools').ensureSlash;

const cdnPathWebpackPlugin = (cdnPaths) => {

    return new CdnPathWebpackPlugin({
        runtimeCdnPath: [ensureSlash(cdnPaths.js, false)], // js动态生成<script src='xxxx'>
        assetsJsCdnPath: [ensureSlash(cdnPaths.js, false)], // html js路径替换
        assetsCssCdnPath: [ensureSlash(cdnPaths.css, false)], // html css路径替换
    })
};

module.exports = cdnPathWebpackPlugin;