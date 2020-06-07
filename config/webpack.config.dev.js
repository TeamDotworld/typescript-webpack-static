const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../src/scripts/index.ts'),
    devtool: "source-map",
    output: {
        chunkFilename: 'js/[name].chunk.js'
    },
    devServer: {
        inline: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            BROWSER_SUPPORTS_HTML5: true,
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, '../public'), to: '.' }
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, '../src'),
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                }
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            },
        ],
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, '../src')
        }
    },
    output: {
        path: path.resolve(__dirname, '../docs'),
    },
};