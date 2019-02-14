const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
//
// const { window } = new JSDOM(``, {
//     url: "http://localhost"
// });

const window = jsdom.jsdom().defaultView;

module.exports = window;
