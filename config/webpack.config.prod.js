const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/scripts/index.ts'),
    stats: 'errors-only',
    devtool: "source-map",
    output: {
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
    },
    devServer: {
        inline: true
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            BROWSER_SUPPORTS_HTML5: true,
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, '../public'), to: 'public' }
        ]),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
            ignoreOrder: false,
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
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
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
    },
};