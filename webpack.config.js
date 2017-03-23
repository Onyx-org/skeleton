var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var publicPath = '/assets/'
var WebpackMd5Hash = require('webpack-md5-hash');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

module.exports = function(debug = false) {
    return {
        entry: {
            main: path.join(__dirname, './assets/js/index')
        },
        output: {
            path: path.join(__dirname, 'www/assets'),
            filename: '[name].[chunkhash].js',
            chunkFilename: '[name].[chunkhash].js',
            publicPath: publicPath
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'file-loader?name=[name].[hash].css', // write css to file
                        },
                        {
                            loader: "extract-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: "sass-loader" // compiles Sass to CSS
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'file-loader?name=[name].[hash].css', // write css to file
                        },
                        {
                            loader: "extract-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        }
                    ]
                },
                {
                    // Any file type that needs to be copied to public assets without any parsing
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)\?*.*/,
                    loader: 'file-loader?name=[name].[hash].[ext]'
                },
                {
                    test: /\.html$/,
                    loader: 'html'
                },
            ]
        },
        resolve: {
            // Look for modules in assets and node_modules
            modules: [path.resolve(__dirname, 'assets'), 'node_modules']
        },
        devtool: 'source-map',
        plugins: [
            new webpack.ProvidePlugin({
                // Map the jQuery module to calls make to $, jQuery & window.jQuery
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                // Required by Bootstrap 4
                'Tether': 'tether'
            }),
            new ManifestPlugin({
                fileName: 'webpack-manifest.json',
                publicPath: publicPath
            }),
            new WebpackMd5Hash(),
            // Extract webpack chunk manifest (internal map of id => module used by webpack) for better caching
            new ChunkManifestPlugin({
                filename: 'chunk-manifest.json',
                manifestVariable: 'webpackManifest'
            }),
            // Extract common code to common.js
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                chunks: ['main', 'admin'],
                minChunks: 2
            }),
            // Extract vendor code specific to main.js to vendor.main.js
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor.main',
                chunks: ['main'],
                minChunks: module => /node_modules\//.test(module.resource)
            }),
            // Extract vendor code specific to admin.js to vendor.admin.js
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor.admin',
                chunks: ['admin'],
                minChunks: module => /node_modules\//.test(module.resource)
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true, // Enable minification
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                beautify: debug,
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
                mangle: {
                    screw_ie8: true, // no support for ie6-8
                }
            }),
        ],
        performance: {
            // Hide webpack files optimization warnings
            hints: false
        }
    };
};
