const pm2 = require('pm2');
const paths = require('../config/paths');
const appName = require(paths.appPackageJson).name;

const console = require('../tools').clog.ssr;

let name = appName;
let processFind = false;

if (!name) {
    console.error('name is missing! please set name in package.json')
}

const formatName = (n) => {
    const pos = n.toLocaleUpperCase().lastIndexOf('_');
    n = n.slice(0, pos);

    return n
};

pm2.list((err, processDescriptionList) => {

    processDescriptionList.forEach((p) => {
        if (formatName(p.name) === name.toLocaleUpperCase()) {

            processFind = true;

            console.log(`server ${name} will stop...`);
            pm2.stop(p.pm_id, (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                console.log(`server ${name} has stopped!`);
                process.exit(0);
            })
        }
    });

    if (!processFind) {
        console.log(`server ${name} cannot find!`);
        process.exit(1)
    }

});