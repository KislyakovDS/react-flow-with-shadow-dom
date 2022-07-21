const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'prod';

const appDirectory = fs.realpathSync(process.cwd());
const isProductionMode = NODE_ENV !== 'development';
const webpackMode = isProductionMode ? 'production' : 'development';
const localIdentName = isProductionMode ? '[hash:base64]' : '[path][name]__[local]';

const lessLoader = {
    loader: 'less-loader',
};

const fontsOptions = isProductionMode
    ? {
          name: '[name].[hash:8].[ext]',
          outputPath: 'static/media/fonts',
          publicPath: '../media/fonts',
          useRelativePaths: true,
      }
    : { name: 'static/media/fonts/[name].[hash:8].[ext]' };

function insertStylesToShadowDom(element) {
    setTimeout(() => {
        var parentEl = document.querySelector('#rootMain');

        if (!parentEl) return;

        var moduleEl = parentEl.querySelector('#shadow');

        if (!moduleEl) {
            moduleEl = document.createElement('div');
            moduleEl.setAttribute('id', 'shadow');

            parentEl.appendChild(moduleEl);

            moduleEl.attachShadow({ mode: 'open' });
        }

        var shadowRoot = moduleEl.shadowRoot;

        if (shadowRoot) {
            const isInsertFirst = element.tagName === 'LINK';

            isInsertFirst ? shadowRoot.insertBefore(element, shadowRoot.firstChild) : shadowRoot.appendChild(element);
        }
    }, 0);
}

const cssLoaders = extra => {
    const loaders = [
        {
            loader: 'style-loader',
        },
        {
            loader: 'css-loader',
            options: {
                modules: {
                    localIdentName,
                    exportLocalsConvention: 'camelCase',
                    auto: resourcePath => resourcePath.endsWith('.module.less'),
                },
            },
        },
    ];

    loaders[0].options = {
        insert: insertStylesToShadowDom,
    };

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
};

const plugins = () => {
    const pluginsList = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            favicon: 'public/favicon.ico',
            chunksSortMode: 'auto',
            env: {
                production: isProductionMode,
            },
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[fullhash:8].css',
            ignoreOrder: true,
            insert: insertStylesToShadowDom,
        }),
    ];

    return pluginsList;
};

module.exports = {
    entry: './src/index.tsx',
    mode: webpackMode,
    devtool: isProductionMode ? false : 'inline-source-map',
    optimization: {
        minimize: isProductionMode,
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
        },
        minimizer: isProductionMode ? [new TerserPlugin(), new CssMinimizerPlugin()] : undefined,
    },
    performance: {
        hints: false,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'linkTag',
                            insert: insertStylesToShadowDom,
                        },
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                use: cssLoaders(lessLoader),
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    fallback: 'file-loader',
                    name: 'static/media/images/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'file-loader',
                options: fontsOptions,
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgo: false,
                        },
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'static/media/svg/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(appDirectory, './src'),
            '@models': path.resolve(appDirectory, './src/models'),
            '@hooks': path.resolve(appDirectory, './src/hooks'),
            '@lib': path.resolve(appDirectory, './src/components/lib'),
        },
    },
    output: {
        filename: isProductionMode ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
        chunkFilename: isProductionMode ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
        path: path.resolve(appDirectory, 'build'),
        publicPath: 'auto',
    },
    plugins: plugins(),
};
