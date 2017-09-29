'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const glob = require('glob');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

const entriesFunc = function(globPath) {
    let files = glob.sync(globPath);
    let entries = {}, entry, dirname, basename;

    for (let i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry.replace(entry.split('/')[0] + '/', ''));
        // basename = path.basename(entry, '.js');
        // entries[path.join(dirname, basename)] = './' + entry;
        basename = path.basename(entry);
        entries[basename] = resolveApp(entry + '/index.js');
    }
    return entries;
};

let entriesMap = entriesFunc('src/pages/*');

const getPublicUrl = appPackageJson =>
envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
        envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}


//add flexible
const flexibleStr = (function(){
    return fs.readFileSync('node_modules/lm-flexible/build/changeRem-min.js', 'utf-8');
})();

const cdnConfig = require(path.resolve('config/cdnPath'));

// config after eject: we're in ./config/
module.exports = {
    dotenv: resolveApp('.env'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/pages/index/index.js'),
    entriesMap: entriesMap,
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveApp('src/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    resolveApp: resolveApp,

    flexibleStr: flexibleStr,

    // todo: 自定义生产环境中build输出位置及cdn地址
    appBuild: resolveApp('build'), // build输出位置
    prodJsCDN: cdnConfig.prodJsCDN,
    prodCssCDN: cdnConfig.prodCssCDN,
    prodImgCDN: cdnConfig.prodImgCDN,
    prodMediaCDN: cdnConfig.prodMediaCDN
};
