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
            new ManifestPlugin({
                fileName: 'webpack-manifest.json',
                publicPath
            })
        ]
    };
}
