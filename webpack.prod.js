var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var merge = require('webpack-merge');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpackCommon = require('./webpack.common.js')();
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = merge(webpackCommon, {
    output: {
        filename: '[id].[name].[chunkhash].js',
        chunkFilename: '[id].[name].[chunkhash].js'
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
        new WebpackMd5Hash(),
        new ChunkManifestPlugin({
            filename: 'chunk-manifest.json',
            manifestVariable: 'webpackManifest'
        }),
        /* Split webpack code from files for easier and more reliable include in html files */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'webpack',
            minChunks: module => /node_modules\/webpack\//.test(module.resource)
        }),
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
            sourceMap: true,
            compress: {
                warnings: false, // display warnings when dropping unreachable code or unused declarations etc.
                screw_ie8: true, // no support for ie6-8
                conditionals: true, // apply optimizations for if-s and conditional expressions
                unused: true, // drop unreferenced functions and variables
                comparisons: true, // apply certain optimizations to binary nodes
                sequences: true, // join consecutive simple statements using the comma operator
                dead_code: true, // remove unreachable code
                evaluate: true, // attempt to evaluate constant expressions
                if_return: true, // optimizations for if/return and if/continue
                join_vars: true, // join consecutive var statements,
            },
            output: {
                comments: false
            },
            mangle : {
                screw_ie8: true, // no support for ie6-8
            }
        }),
    ]
});
