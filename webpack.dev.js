var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');

module.exports = merge(webpackCommon(), {
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
    }
});
