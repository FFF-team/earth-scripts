const getInitialData = async (Component, ctx) => {

    if (!Component.getInitialProps) return {};

    const props = await Component.getInitialProps(ctx)
        .catch((e) => {
            console.log(e)
        });

    return props
};

module.exports = getInitialData;