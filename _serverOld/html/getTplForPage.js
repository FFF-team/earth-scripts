const flexibleStr = require('earth-scripts/config/paths').flexibleStr;
const getTplByPage = require('../context').getTplByPage;

const getTplForPage = (ctx, page, stringMarkup, preloadState, options) => {
    const tpl = getTplByPage(page);

    // add other option
    options.flexibleStr = flexibleStr;

    if (tpl) {
        return tpl(stringMarkup, preloadState, options, ctx)
    }

    return ''
};

module.exports = getTplForPage;