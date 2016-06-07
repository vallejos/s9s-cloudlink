'use strict';

exports
    = module.exports
    /**
     * @param {{use:function}} app
     */
    = (app) => {

    app.use((request, result, next) => {
        result
            .status(404)
            .json({
                status: false,
                error: 'Not Found',
                code: 404
            });
    });

};
