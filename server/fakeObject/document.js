const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { document } = (new JSDOM(``, {
    url: "http://localhost"
})).window;

module.exports = document;

