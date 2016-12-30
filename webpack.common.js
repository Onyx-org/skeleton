var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

const outputPath =  path.join(__dirname, 'www/assets');

module.exports = function(publicPath = '/assets/') {
    return {
        entry: {
            vendor: './assets/vendor',
            main: './assets/main',
            admin: './assets/admin'
        },
        output: {
            path: outputPath,
            filename: '[name].js',
            publicPath
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                },
                {
                    // Any file type that needs to be copied to public assets without any parsing
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)\?*.*/,
                    loader: 'file-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'html'
                },
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new ManifestPlugin({
                fileName: 'webpack-manifest.json',
                publicPath
            })
        ]
    };
}
