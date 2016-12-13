var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        vendor: './assets/vendor',
        main: './assets/main',
        admin: './assets/admin'
    },
    output: {
        path: path.join(__dirname, 'www/assets'),
        filename: '[name].js',
        publicPath: '/assets'
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
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            // The order of this array matters
            name: 'common',
            chunks: ['main', 'admin'],
            minChunks: 2
        }),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'views/layout.twig'),
            template: 'views/layout.twig.tpl',
            excludeChunks: ['admin']
        })
    ]
};
