const logger = require('../lib/logger');

const getInitialData = async (Component, ctx, store) => {

    if (!Component.getInitialProps) return {};

    const props = await Component.getInitialProps(ctx, store)
        .catch((e) => {
            logger.error(e.stack)
        });

    return props
};

module.exports = getInitialData;