const def = require('../def');

module.exports = () => {
    return process.env.NODE_ENV === def.env.Online
};
