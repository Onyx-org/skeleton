var webpack = require('webpack');
var path = require('path');
var merge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');
var WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = function(options) {
    if (options.devServer) {
        var common = webpackCommon('http://localhost:' + options.port + '/assets/');
    } else {
        var common = webpackCommon();
    }

    var config = merge(common, {
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
            port: options.port || 9000
        },
        plugins: [
            new WriteFilePlugin({
                test: /webpack-manifest\.json/,
                useHashIndex: false
            })
        ]
    });


    return config;
}
