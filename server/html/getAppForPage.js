const React = require('react');
const logger = require('../lib/logger');
const {getAppByPage} = require('../context');
const Missing = require('./MissingComp');

module.exports = (page) => {

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
