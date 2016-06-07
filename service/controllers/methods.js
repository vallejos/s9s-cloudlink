'use strict';

exports
    = module.exports
    /**
     * @param {{get:function}} app
     * @param {CloudLink} CloudLink
     */
    = (app, CloudLink) => {

    /**
     * Handle GET /methods requests
     */
    app.get('/methods', (request, response) => {
        response.json({
            status: true,
            data: CloudLink.allowedMethods
        });
    });

};
