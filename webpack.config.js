const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: {
        main: './src/index.ts',
        particles: './src/ui/particles.js',
    },
    output: {
        path: path.join(__dirname, 'lib'),
        library: 'Translator',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: '@ts-tools/webpack-loader',
            },
            {
                test: /\.css$/,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
    },
    optimization: {
        minimize: true,
        minimizer: isDev ? [] : [new CssMinimizerPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/ui/template.html',
            favicon: './src/ui/favicon.ico',
            minify: {
                minifyJS: !isDev,
            },
        }),
    ].concat(isDev ? [] : [new MiniCssExtractPlugin()]),
};
