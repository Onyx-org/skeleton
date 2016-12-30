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
                loader: ExtractTextPlugin.extract('css-loader?sourceMap!sass-loader?sourceMap')
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
    devtool: 'cheap-module-source-map',
    plugins: [
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new webpack.optimize.CommonsChunkPlugin({
            // The order of this array matters
            name: 'common',
            chunks: ['main', 'admin'],
            minChunks: 2
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin(),
    ]
});
