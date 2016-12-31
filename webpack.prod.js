var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var merge = require('webpack-merge');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpackCommon = require('./webpack.common.js')();

module.exports = merge(webpackCommon, {
    output: {
        filename: '[name].[chunkhash].js',
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: [
                    'file-loader?name=[name].[hash].css',
                    'extract-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.html$/,
                loader: 'html',
                query: {
                    minimize: true,
                    removeAttributeQuotes: false,
                    caseSensitive: true,
                    // Teach html-minifier about Angular 2 syntax
                    customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
                    customAttrAssign: [ /\)?\]?=/ ],
                }
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            // The order of this array matters
            name: 'common',
            chunks: ['main', 'admin'],
            minChunks: 2
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.main',
            chunks: ['main'],
            minChunks: module => /node_modules\//.test(module.resource)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.admin',
            chunks: ['admin'],
            minChunks: module => /node_modules\//.test(module.resource)
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
    ]
});
