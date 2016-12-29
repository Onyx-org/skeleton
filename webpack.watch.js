var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');
var WriteFilePlugin = require('write-file-webpack-plugin');

const port = parseInt(process.env.DEV_SERVER_PORT) || 9000;

module.exports = merge(webpackCommon('http://localhost:' + port + '/assets/'), {
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
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
    plugins: [
        new WriteFilePlugin({
            test: /webpack-manifest\.json/,
            useHashIndex: false
        })
    ]
});
