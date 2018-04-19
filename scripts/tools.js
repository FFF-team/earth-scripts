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
                resolveApp(`src/pages/${page}/index.js`)
            ])
        ) {
            return false
        }
    }
    return true
};

module.exports = {
    checkPagesRequired,
    resolveApp
};