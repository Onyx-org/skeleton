var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');

module.exports = merge(webpackCommon(), {
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style-loader?sourceMap', 'css-loader?sourceMap', 'sass-loader?sourceMap']
            }
        ]
    },
    // In dev mode, don't waste time generating a file for the sourcemap
    // Inject them directly into the code (eval)
    devtool: 'eval-source-map',
    performance: {
        // Hide webpack files optimization warnings
        hints: false
    }
});
