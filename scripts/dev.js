'use strict';

process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const configFactory = require('../config/webpack.config.js');

const compiler = webpack(configFactory);

const devServer = new WebpackDevServer(
    {
        port: parseInt(process.env.PORT, 10) || 3000,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        open: true,
    },
    compiler
);

const runServer = async () => {
    console.log('Starting server...');
    await devServer.start();
};

void runServer();
