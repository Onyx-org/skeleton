var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');
var WriteFilePlugin = require('write-file-webpack-plugin');

// Read port from environment variable. See Makefile
const port = parseInt(process.env.DEV_SERVER_PORT) || 9000;

// Webpack watch is run within the webpack devserver, therefore
// the public path is actually a localserver
module.exports = merge(webpackCommon('http://localhost:' + port + '/assets/'), {
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style-loader?sourceMap', 'css-loader?sourceMap', 'sass-loader?sourceMap']
            }
        ]
    },
    performance: {
        hints: false
    },
    devServer: {
        host: '0.0.0.0',
        compress: true,
        inline: true,
        port
    },
    devtool: 'eval-source-map',
    plugins: [
        // Webpack dev server keeps files in memory but for the application we need the manifest
        // Forces the devserver to write the manifest
        new WriteFilePlugin({
            test: /webpack-manifest\.json/,
            useHashIndex: false
        })
    ]
});
