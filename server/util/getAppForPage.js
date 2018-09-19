const React = require('react');
const logger = require('../util/logger');

function _getPage(pageList, currentPage) {
    const ret =  pageList.filter((v, i) => v.indexOf(currentPage) > -1)
    return ret.length ? ret[0] : null
}

module.exports = (page) => {

    class Missing extends React.Component {
        render() {
            return <span/>
        }
    }

    let App = Missing;

    try {
        // clientSrc/pages/${page}/containers
        const context = require.context(`clientSrc/pages`, true, /containers\/App\.js/);
        const pagePath = _getPage(context.keys(), page);
        App = context(pagePath).default || context(pagePath);
    } catch (e) {

        logger.error(e.stack);

        console.log(`${page}/containers/App.js 没找到`);

    }

    return App
};
