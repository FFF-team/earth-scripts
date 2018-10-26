const pm2 = require('pm2');

const console = require('../tools').clog.ssr;
const args = process.argv.slice(2);

let name = require('yargs').parse(args).name;
let processFind = false;

if (!name) {
    console.error('name is missing! please use --name=PROJECT_NAME')
}

const formatName = (n) => {
    const pos = n.toLocaleUpperCase().lastIndexOf('_');
    n = n.slice(0, pos);

    return n
};

pm2.list((err, processDescriptionList) => {

    processDescriptionList.forEach((p) => {
        if (formatName(p.name) === name) {

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