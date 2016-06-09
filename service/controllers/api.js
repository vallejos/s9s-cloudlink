'use strict';

exports
    = module.exports
    /**
     * @param {{post:function}} app
     * @param CloudLink
     */
    = (app, CloudLink) => {

    /**
     * Handle all api POST requests
     * :cloud  => cloud code identifier
     * :method => api method to call
     */
    app.post('/:cloud/:method',
        /**
         * @param {{params:{cloud:{}},body:{}}} request
         * @param {{status:function,json:function}} response
         * @returns {*}
         */
        (request, response) => {

            /**
             * Send an http response
             * @param {boolean} status
             * @param {number} code
             * @param {{}|string} data
             */
            function sendResponse(status, code, data) {
                const responseData = {
                    status: !!status,
                    code: code
                };
                if (status) {
                    responseData.data = data;
                } else {
                    responseData.error = data;
                }
                response
                    .status(code)
                    .json(responseData)
            }

            const cloudCode = request.params.cloud;
            const body = request.body;
            const method = request.params.method;

            /** Check if cloud is supported */
            if (!CloudLink.cloudExists(cloudCode)) {
                return sendResponse(
                    false,
                    400,
                    'Cloud not found. Refer to /clouds for a list of allowed clouds.'
                );
            }

            /** Check if method is supported */
            if (!CloudLink.methodExists(method)) {
                return sendResponse(
                    false,
                    405,
                    'Method not allowed. Refer to /methods for a list of allowed methods.'
                );
            }

            const cloudInstance = CloudLink
                .factory(cloudCode, request.body.auth || {});

            const args = CloudLink
                .methodArguments(cloudCode, method);

            let requestArguments = {};

            /**
             * Generate method arguments object
             */
            if (args !== null) {
                for (let arg in args) {
                    if (args.hasOwnProperty(arg)) {
                        if (!(arg in body)) {
                            return sendResponse(
                                false,
                                400,
                                `'${arg}' arguments missing for '${method}'`
                            );
                        }
                        if (typeof(args[arg]) === 'string' && typeof(body[arg]) !== args[arg]) {
                            return sendResponse(
                                false,
                                400,
                                `'${arg}' expected to be a '${args[arg]}'`
                            );
                        } else if (args[arg] instanceof Array) {
                            if (args[arg].indexOf(typeof(body[arg])) === -1) {
                                return sendResponse(
                                    false,
                                    400,
                                    `'${arg}' expected to be '${args[arg].join('\' or \'')}'`
                                );
                            }
                        }
                        requestArguments[arg] = body[arg];
                    }
                }
            }

            /**
             * Call the API method
             */
            cloudInstance[method]
                .call(cloudInstance, requestArguments)
                .then((result) => {
                    response.json({
                        status: true,
                        data: result.toJson ? result.toJson() : result
                    });
                })
                .catch((error) => {
                    return sendResponse(
                        false,
                        500,
                        error.message || error || 'Unknown error'
                    );
                });
        }
    );

};
