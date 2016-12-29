var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

function isWebpackDevServer() {
    var isDevServer = false;

    process.argv.forEach(function(arg) {
        if (/webpack-dev-server$/.test(arg)) {
            isDevServer = true;
        }
    });

    return isDevServer;
}

try {
    var appConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config/built-in/app.yml'), 'utf8'));
    if (appConfig.debug) {
        module.exports = require('./webpack.dev.js')({
            port: parseInt(process.env.DEV_SERVER_PORT),
            devServer: isWebpackDevServer()
        });
    } else {
        if (isWebpackDevServer()) {
            throw new Error('Webpack dev server not allowed in production mode');
        }
        module.exports = require('./webpack.prod.js');
    }
} catch (e) {
    console.error(e);
}
