'use strict';

exports = module.exports = (namespace) => {

    const CloudMethodNotImplementedError = namespace.requireOnce('Cloud/CloudMethodNotImplementedError');

    /**
     * Abstract cloud class
     */
    return class BaseCloud {

        /**
         * @param {{}} config
         */
        constructor(config) {
            this.config = config || {};
        }

        /**
         * @param method
         * @returns {{}|null}
         */
        static getMethodArguments(method) {
            const args = {
                addInstance: {
                    'params': 'object'
                },
                listDistributions: {
                    'filters': 'object'
                },
                getInstanceStatus: {
                    'instanceId': [
                        'string',
                        'number'
                    ]
                }
            };
            return args[method] || null;
        }

        /**
         * Abstraction: Returns a promise with a list of instances
         * @returns {Promise}
         */
        listInstances() {
            throw new CloudMethodNotImplementedError('listInstances is not implemented');
        }

        /**
         * Abstraction: Creates a new instance
         * @param params
         * @returns {Promise}
         * @abstract
         */
        addInstance({params:params = {}} = {}) {
            throw new CloudMethodNotImplementedError('addInstance is not implemented');
        }

        /**
         * Abstraction: Returns a promise with a list of regions
         * @returns {Promise}
         */
        listRegions() {
            throw new CloudMethodNotImplementedError('listRegions is not implemented');
        }

        /**
         * Abstraction: Returns a promise with a list of instance sizes
         * @returns {Promise}
         */
        listSizes() {
            throw new CloudMethodNotImplementedError('listSizes is not implemented');
        }

        /**
         * Abstraction: Returns a promise with a list of distributions
         * @param {{}} [filters]
         * @returns {Promise}
         */
        listDistributions({filters = {}} = {}) {
            throw new CloudMethodNotImplementedError('listDistributions is not implemented');
        }

        /**
         * Abstraction: Returns a promise with a list of volumes
         * @returns Promise
         */
        listVolumes() {
            throw new CloudMethodNotImplementedError('listVolumes is not implemented');
        }

        /**
         * Abstraction: Returns a promise with instance status
         * @param instanceId
         * @returns {Promise}
         */
        getInstanceStatus({instanceId:instanceId} = {}) {
            throw new CloudMethodNotImplementedError('getInstanceStatus is not implemented');
        }

    }

};