const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { window } = new JSDOM(``, {
    url: "http://localhost"
});

module.exports = window;
