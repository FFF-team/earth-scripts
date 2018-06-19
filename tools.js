const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const path = require('path');
const fs = require('fs');

// todo: 抽取公共tools
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const checkPagesRequired = (allPagesName) => {
    let page = '';
    for (let i = 0, len = allPagesName.length; i < len; i++) {
        page = allPagesName[i];
        if (!checkRequiredFiles([
                resolveApp(`public/${page}.html`),
                isSinglePage() ? resolveApp('src/index.js') : resolveApp(`src/pages/${page}/index.js`)
            ])
        ) {
            return false
        }
    }
    return true
};

/**
 * get port from `package.json` proxy
 * @param proxy
 */
const getLocalMockPort = (proxy) => {

    const ip = require('ip').address().replace(/\./g, '\\.');

    const proxyMatch = new RegExp(`https*://(localhost|127\\.0\\.0\\.1|${ip}):(\\d+)`).exec(proxy);

    return proxyMatch ? proxyMatch[2] : ''

};

const isSinglePage = () => !fs.existsSync(resolveApp(`src/pages/`));


module.exports = {
    checkPagesRequired,
    resolveApp,
    getLocalMockPort,
    isSinglePage
};