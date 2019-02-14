const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
//
// const { document } = (new JSDOM(``, {
//     url: "http://localhost"
// })).window;

const window = jsdom.jsdom().defaultView;
const document = window.document;

module.exports = document;

