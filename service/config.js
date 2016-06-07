'use strict';

const bodyParser = require('body-parser');

exports
    = module.exports
    /**
     * @param {{set:function,use:function}} app
     */
    = (app) => {

    /**
     * Output pretty json
     */
    app.set('json spaces', 2);

    /**
     * Parse request body as JSON
     */
    app.use(bodyParser.json());

};
