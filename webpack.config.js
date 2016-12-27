var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

try {
    var appConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config/built-in/app.yml'), 'utf8'));
    if (appConfig.debug) {
        module.exports = require('./webpack.dev.js');
    } else {
        module.exports = require('./webpack.prod.js');
    }
} catch (e) {
    console.error(e);
}
