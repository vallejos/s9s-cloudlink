'use strict';

exports
    = module.exports
    /**
     * @param {{get:function}} app
     */
    = (app) => {

    /**
     * Handler GET / requests
     */
    app.get('/', (request, response) => {
        response.json({
            status: true,
            data: {
                name: 'CloudLink Api Service',
                help: [
                    'Use GET /clouds to list the supported cloud providers',
                    'Use GET /methods to list the supported methods'
                ]
            }
        });
    });

};
