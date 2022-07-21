'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'prod';

const webpack = require('webpack');
const configFactory = require('../config/webpack.config');

const compiler = webpack(configFactory);
compiler.run((err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        console.error(info.errors);
    }

    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }

    console.log(
        stats.toString({
            colors: true,
        })
    );
});
