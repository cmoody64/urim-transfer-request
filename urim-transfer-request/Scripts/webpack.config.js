var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', './src/main.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exlude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            }
        ]
    },
    stats: {
        colors: true,
    },
    devtool: 'source-map'
};
