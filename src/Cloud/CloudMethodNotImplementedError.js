'use strict';

exports = module.exports = (namespace) => {

    const CloudError = namespace.requireOnce('Cloud/CloudError');

    /**
     * CloudMethodNotImplementedError class
     * @extends {CloudError}
     */
    return class CloudMethodNotImplementedError extends CloudError {
    }

};
