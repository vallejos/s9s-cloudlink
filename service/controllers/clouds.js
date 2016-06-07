'use strict';

exports
    = module.exports
    /**
     * @param {{get:function}} app
     * @param {CloudLink} CloudLink
     */
    = (app, CloudLink) => {

    /**
     * Handle GET /clouds requests
     */
    app.get('/clouds', (request, response) => {
        const clouds = [];
        for (let cloudCode in CloudLink.allowedClouds) {
            if (CloudLink.allowedClouds.hasOwnProperty(cloudCode)) {
                clouds.push({
                    name: CloudLink.allowedClouds[cloudCode],
                    code: cloudCode
                })
            }
        }
        response.json({
            status: true,
            data: clouds
        });
    });

};
