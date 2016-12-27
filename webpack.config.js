var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestPlugin = require('webpack-manifest-plugin');

const publicPath = '/assets/';

module.exports = {
    entry: {
        vendor: './assets/vendor',
        main: './assets/main',
        admin: './assets/admin'
    },
    output: {
        path: path.join(__dirname, 'www/assets'),
        filename: '[name].[chunkhash].js',
        publicPath
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
                // Any file type that needs to be copied to public assets without any parsing
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)\?*.*/,
                loader: 'file-loader'
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new webpack.optimize.CommonsChunkPlugin({
            // The order of this array matters
            name: 'common',
            chunks: ['main', 'admin'],
            minChunks: 2
        }),
        new ManifestPlugin({
            fileName: 'webpack-manifest.json',
            publicPath
        })
    ]
};
