'use strict';

exports = module.exports = (namespace) => {

    const CloudMethodNotImplementedError = namespace
        .requireOnce('Cloud/CloudMethodNotImplementedError');

    /**
     * Abstract cloud class
     * @abstract
     * @property {{}} config
     */
    class BaseCloud {

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
                    'names': 'object',
                    'region': 'string',
                    'size': 'string',
                    'image': 'string',
                    'disk': 'number',
                    'subnet': [
                        'string',
                        'number',
                        'object' // required for null
                    ],
                    'sshKeys': [
                        'string',
                        'object'
                    ]
                },
                listInstances: {
                    'ids': 'object'
                },
                deleteInstance: {
                    'ids': 'object'
                },
                listDistributions: {
                    'filters': 'object'
                },
                getInstanceStatus: {
                    'instanceId': [
                        'string',
                        'number'
                    ]
                },
                addKey: {
                    'name': 'string',
                    'publicKey': 'string'
                },
                deleteKey: {
                    'id': [
                        'string',
                        'number'
                    ]
                },
                listVpcs: {
                    'filters': 'object',
                    'ids': 'object'
                },
                addVpc: {
                    'cidr': 'string',
                    'tenancy': 'string'
                },
                listSubNets: {
                    'filters': 'object',
                    'ids': 'object'
                },
                addNetworkAcl: {
                    'vpcId': [
                        'string',
                        'number'
                    ],
                    'entries': 'object'
                },
                addNetworkAclEntry: {
                    'aclId': [
                        'string',
                        'number'
                    ],
                    'entries': 'object'
                }
            };
            return args[method] || null;
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of instances
         * @param ids
         * @returns {Promise}
         */
        listInstances({ids = []} = {}) {
            throw new CloudMethodNotImplementedError(
                'listInstances is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Creates a new instance
         * @param params
         * @returns {Promise}
         * @abstract
         */
        addInstance({params:params = {}} = {}) {
            throw new CloudMethodNotImplementedError(
                'addInstance is not implemented'
            );
        }

        /**
         * Abstraction: Deletes an instance from cloud
         * @param params
         * @returns {Promise}
         * @abstract
         */
        deleteInstance({params:params = {}} = {}) {
            throw new CloudMethodNotImplementedError(
                'deleteInstance is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of regions
         * @returns {Promise}
         */
        listRegions() {
            throw new CloudMethodNotImplementedError(
                'listRegions is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of instance sizes
         * @returns {Promise}
         */
        listSizes() {
            throw new CloudMethodNotImplementedError(
                'listSizes is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of distributions
         * @param {{}} [filters]
         * @returns {Promise}
         */
        listDistributions({filters = {}} = {}) {
            throw new CloudMethodNotImplementedError(
                'listDistributions is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of volumes
         * @returns Promise
         */
        listVolumes() {
            throw new CloudMethodNotImplementedError(
                'listVolumes is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with instance status
         * @param instanceId
         * @returns {Promise}
         */
        getInstanceStatus({instanceId:instanceId} = {}) {
            throw new CloudMethodNotImplementedError(
                'getInstanceStatus is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of keys
         * @returns {Promise}
         */
        listKeys() {
            throw new CloudMethodNotImplementedError(
                'listKeys is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with the result of addKey operation
         * @param name
         * @param publicKey
         * @return {Promise}
         */
        addKey({name = null, publicKey = null} = {}) {
            throw new CloudMethodNotImplementedError(
                'addKey is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with the result of deleteKey operation
         * @param id
         * @return {Promise}
         */
        deleteKey({id = null} = {}) {
            throw new CloudMethodNotImplementedError(
                'deleteKey is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of Vpcs
         * @param {{}} filters
         * @param {[]} ids
         * @returns {Promise}
         */
        listVpcs({filters = {}, ids = []} = {}) {
            throw new CloudMethodNotImplementedError(
                'listVpcs is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with the result of addVpc operation
         * @param {string} cidr
         * @param {string} tenancy
         * @returns {Promise}
         */
        addVpc({cidr = null, tenancy = 'default'} = {}) {
            throw new CloudMethodNotImplementedError(
                'addVpc is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with a list of SubNets
         * @param {{}} filters
         * @param {[]} ids
         * @returns {Promise}
         */
        listSubNets({filters = {}, ids = []} = {}) {
            throw new CloudMethodNotImplementedError(
                'listSubNets is not implemented'
            );
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Abstraction: Returns a promise with the result of addSubNet operation
         * @param {string} cidr
         * @param {string} vpcId
         */
        addSubNet({cidr = null, vpcId = null} = {}) {
            throw new CloudMethodNotImplementedError(
                'addSubNet is not implemented'
            );
        }

        //noinspection JSMethodCanBeStatic
        /**
         * Abstraction: Returns a promise with the result of addNetworkAcl operation
         * @param {string} vpcId
         * @param {Array} entries
         */
        addNetworkAcl({vpcId = null, entries = []}) {
            throw new CloudMethodNotImplementedError(
                'addNetworkAcl is not implemented'
            );
        }

        //noinspection JSMethodCanBeStatic
        /**
         * Abstraction: Returns a promise with the result of addNetworkAcl operation
         * @param {string} aclId
         * @param {number} entries
         */
        addNetworkAclEntry({aclId = null, entries = []}) {
            throw new CloudMethodNotImplementedError(
                'addNetworkAclEntry is not implemented'
            );
        }

    }

    return BaseCloud;

};
