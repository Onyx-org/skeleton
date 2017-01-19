var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

const outputPath =  path.join(__dirname, 'www/assets');

module.exports = function(publicPath = '/assets/') {
    return {
        entry: {
            main: './assets/main',
            admin: './assets/admin'
        },
        output: {
            path: outputPath,
            filename: '[id].[name].js',
            chunkFilename: '[id].[name].js',
            publicPath
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            [
                                'es2015', // convert es2015
                                {
                                    // Disable native module to commonJS transformation so Tree Shaking works
                                    modules: false
                                }
                            ],
                        ],
                    }
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
                publicPath,
            })
        ]
    };
}
