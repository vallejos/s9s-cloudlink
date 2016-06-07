'use strict';

const express = require('express');
const path = require('path');
const filesystem = require('s9s-filesystem');
const CloudLink = require('../src/CloudLink');
const app = express();

exports = module.exports = app;

/**
 * Require into app
 * @param requirePath
 * @returns {*}
 */
app.require = (requirePath) => {
    requirePath = path.join(__dirname, requirePath);
    require(requirePath)(app, CloudLink);
    return app;
};

/**
 * Require folder into app
 * @param requirePath
 * @returns {*}
 */
app.requireFolder = (requirePath) => {
    requirePath = path.join(__dirname, requirePath);
    filesystem
        .listDirectory(requirePath)
        .forEach((file) => {
            require(path.join(requirePath, file))(app, CloudLink);
        });
    return app;
};
