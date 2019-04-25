const paths = require('../config/paths');
const resolveApp = require('../tools').resolveApp;
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const chalk = require('chalk');

const customerMock = require(paths.appPackageJson).mockRoot;
if (customerMock) {
    const customerMockPath = resolveApp(`mock/${customerMock}`);
    if (checkRequiredFiles([customerMockPath])) {
        console.log(chalk.green('\n custom mock is running! \n'));
        require('../mock/run').start(customerMockPath);
    } else {
        console.log(chalk.yellow(`\n mock warning: \n missing mock/${customerMock}, start default mockServer\n\n`));
        require('../mock/run').start();
    }
} else {
    console.log(chalk.green('\n default mock is running! \n'));
    require('../mock/run').start();
}