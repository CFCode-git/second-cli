const { resolve } = require('./utils')
const jsRules = require('./rules/jsRules')
const styleRules = require('./rules/styleRules')
const imageRules = require('./rules/imageRules')
const plugins = require('./plugins')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const optimization = require('./optimization')

const isDev = process.env.NODE_ENV === 'development'

/**
 * @type {import('webpack').Configuration}
 */

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        app: resolve('src/index.tsx'),
    },
    output: {
        path: resolve('dist'),
        filename: isDev ? '[name].js' : '[name].[chunkhash].js',
        chunkFilename: isDev ? '[name].js' : '[name].[chunkhash].js',
        // publicPath: "https://cdn.xxx.com/",
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        // alias: {
        //   "@views": resolve("src/containers/views"),
        //   "@shared": resolve("src/containers/shared"),
        // },
        plugins: [
            new TsconfigPathsPlugin({
                // 配置文件引入tsconfig.json
                configFile: resolve('tsconfig.json'),
            }),
        ],
    },
    module: {
        rules: [...jsRules, ...styleRules, ...imageRules],
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [...plugins],
    devtool: isDev ? 'source-map' : undefined,
    optimization: isDev ? {} : optimization,
}
