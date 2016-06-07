'use strict';

/**
 * ExpressJs application
 * @type {*}
 */
const app = require('./service/service');

/**
 * Load configurations
 */
app.require('config');

/**
 * Load controllers
 */
app.requireFolder('controllers');

/**
 * Load error controllers
 */
app.requireFolder('controllers/errors');

/**
 * Start listening (use env.PORT or 3000 as default)
 */
app.listen(process.env.PORT || 3000);
