const React = require('react');
const logger = require('../lib/logger');
const {getAppByPage} = require('../context')

module.exports = (page) => {

    class Missing extends React.Component {
        render() {
            return <span/>
        }
    }

    let App = Missing;

    try {
        // clientSrc/pages/${page}/containers
        App = getAppByPage(page).default
    } catch (e) {

        logger.error(e.stack);

        console.log(`${page}/containers/App.js 没找到`);

    }

    return App
};
