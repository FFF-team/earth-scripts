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
                resolveApp(`template/${page}.html`),
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


// TODO: console 统一写法
const chalk = require('chalk');

const clog = {

    prefix: chalk.blue('[earth-scripts] '),

    get ssr () {
        this.prefix = chalk.blue('[earth-scripts:ssr] ');
        return clog;
    },
    get client() {
        this.prefix = chalk.blue('[earth-scripts:client] ');
        return clog;
    },
    info: (msg) => {
        console.log(clog.prefix + chalk.green(msg))
    },
    warn: (msg) => {
        console.log(clog.prefix + chalk.yellow(msg))
    },
    error: (msg) => {
        console.log(clog.prefix + chalk.red(msg))
    },
    log: (msg) => {
        console.log(clog.prefix + msg)
    }
};

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


module.exports = {
    checkPagesRequired,
    resolveApp,
    getLocalMockPort,
    isSinglePage,
    clog,
    ensureSlash
};