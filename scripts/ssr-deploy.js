const spawn = require('cross-spawn');
const pm2 = require('pm2');
const path = require('path');
const yargs = require('yargs');
const console = require('../tools').clog.ssr;

const args = process.argv.slice(2);
const env = yargs.parse(args).env;

// todo: 覆盖掉ENABLE_BUNDLE_ANALYZE=true 的配置,其他写法，可以提到配置中去
process.env.ENABLE_BUNDLE_ANALYZE = 'false';


console.info(`current environment: ${env}`);

let PM2_CONFIG = {};

try {
    PM2_CONFIG = require(path.resolve(__dirname, `../server/eco.${env}.js`))
} catch (e) {
    console.error(`cannot support env: ${env}`)
    console.log(e)
}

const startPm2 = () => {
    pm2.connect(function (err) {
        console.log('pm2 connect...');

        if (err) {
            console.error(err);
            process.exit(2);
        }

        pm2.start(PM2_CONFIG,
            function (err, apps) {
                console.log('start pm2: ' + err)
                pm2.disconnect();   // Disconnects from PM2
                if (err) throw err
            });
    });
};

startPm2();

/*// copy from next.js :)
const startProcess = () => {
    const proc = spawn('node', [require.resolve('./build')], { stdio: 'inherit'});
    // startPm2();
    proc.on('close', (code, signal) => {
        console.log('this is close event');
        console.log(`code: ${code}`);
        console.log(`signal: ${signal}`);

        if (code !== null) {

            console.log('code !== null trace!')
            // todo： 其他方式
            startPm2()

            // process.exit(code)
        }
        if (signal) {
            if (signal === 'SIGKILL') {
                process.exit(137)
            }
            console.log(`got signal ${signal}, exiting`);
            process.exit(signal === 'SIGINT' ? 0 : 1)
        }

        // process.exit(0)
    });
    proc.on('error', (err) => {
        console.error(err);
        process.exit(1)
    });
    return proc
};

let proc = startProcess();

const wrapper = () => {
    if (proc) {
        proc.kill()
    }
};
process.on('SIGINT', wrapper);
process.on('SIGTERM', wrapper);
process.on('exit', wrapper);*/
