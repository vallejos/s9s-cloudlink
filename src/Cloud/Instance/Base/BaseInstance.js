'use strict';

exports = module.exports = (namespace) => {

    const BaseObject = namespace.requireOnce('Cloud/Base/BaseObject');
    const InstanceMethodNotImplementedError = namespace.requireOnce('Cloud/Instance/InstanceMethodNotImplementedError');

    /**
     * Abstract instance class
     */
    return class BaseInstance extends BaseObject {

        /**
         * @returns {{}}
         */
        get jsonParams() {
            return {
                id: this.getId,
                name: this.getName,
                memory: this.getMemory,
                cpu: this.getCpu,
                disk: this.getDiskSpace,
                publicIps: this.getPublicIps,
                privateIps: this.getPrivateIps,
                region: this.getRegion,
                status: this.getStatus
            };
        }

        /**
         * @param {{}} instance
         */
        constructor(instance) {
            super();
            for (var i in instance) {
                if (instance.hasOwnProperty(i)) {
                    this[i] = instance[i];
                }
            }
        }

        /**
         * Abstraction: Returns instance id
         */
        getId() {
            throw new InstanceMethodNotImplementedError('getId is not implemented');
        }

        /**
         * Abstraction: Returns instance name
         * @returns {string}
         */
        getName() {
            throw new InstanceMethodNotImplementedError('getName is not implemented');
        }

        /**
         * Abstraction: Returns instance RAM
         * (in megabytes)
         * @returns {number}
         */
        getMemory() {
            throw new InstanceMethodNotImplementedError('getMemory is not implemented');
        }

        /**
         * Abstraction: Returns number of CPUs for instance
         * @returns {number}
         */
        getCpu() {
            throw new InstanceMethodNotImplementedError('getCpu is not implemented');
        }

        /**
         * Abstraction: Returns total amount of disk space for instance
         * (in gigabytes)
         * @returns {number}
         */
        getDiskSpace() {
            throw new InstanceMethodNotImplementedError('getDiskSpace is not implemented');
        }

        /**
         * Abstraction: Returns a list of public ip addresses
         * @returns {[]}
         */
        getPublicIps() {
            throw new InstanceMethodNotImplementedError('getPublicIps is not implemented');
        }

        /**
         * Abstraction: Returns a list of private ip addresses
         * @returns {[]}
         */
        getPrivateIps() {
            throw new InstanceMethodNotImplementedError('getPrivateIps is not implemented');
        }

        /**
         * Abstraction: Returns instance region
         * @returns {Region}
         */
        getRegion() {
            throw new InstanceMethodNotImplementedError('getRegion is not implemented');
        }

        /**
         * Abstraction: Returns instance status
         * @returns {Status}
         */
        getStatus() {
            throw new InstanceMethodNotImplementedError('getStatus is not implemented');
        }

    }

};
