const CdnPathWebpackPlugin = require("html-webpack-cdn-path-plugin");
const util = require('../util')

const cdnPathWebpackPlugin = (cdnPaths) => {

    return new CdnPathWebpackPlugin({
        runtimeCdnPath: [util.ensureSlash(cdnPaths.js, false)], // js动态生成<script src='xxxx'>
        assetsJsCdnPath: [util.ensureSlash(cdnPaths.js, false)], // html js路径替换
        assetsCssCdnPath: [util.ensureSlash(cdnPaths.css, false)], // html css路径替换
    })
};

module.exports = cdnPathWebpackPlugin;