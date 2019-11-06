const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');

const pageEntry = {
    SINGLE: 'src/{index.js,index.ts,index.tsx,index.jsx}',
    MULTI: (page) => `src/pages/${page}/{index.js,index.ts,index.tsx,index.jsx}`
};

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const checkPagesRequired = (allPagesName) => {
    let page = '';
    for (let i = 0, len = allPagesName.length; i < len; i++) {
        page = allPagesName[i];
        if (!checkRequiredFiles([
                resolveApp(`public/${page}.html`),
                isSinglePage() ?
                    getClientEntryFile(pageEntry.SINGLE) :
                    getClientEntryFile(pageEntry.MULTI(page))
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

/**
 * entry file support multiple ext
 * @param file
 */
const getClientEntryFile = (file) => {

    const files = glob.sync(file);

    if (!files.length) {
        const dirName = path.dirname(file);
        const fileName = path.basename(file);
        console.log(chalk.red('Could not find a required file.'));
        console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
        console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));
        process.exit(1)
    }

    return resolveApp(files[0])

};

module.exports = {
    checkPagesRequired,
    resolveApp,
    getLocalMockPort,
    isSinglePage,
    getClientEntryFile,
    pageEntry
};
