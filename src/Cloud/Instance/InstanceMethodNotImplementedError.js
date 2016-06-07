'use strict';

exports = module.exports = (namespace) => {

    const InstanceError = namespace.requireOnce('Cloud/Instance/InstanceError');

    /**
     * InstanceMethodNotImplementedError class
     * @extends {InstanceError}
     */
    return class InstanceMethodNotImplementedError extends InstanceError {
    }

};
