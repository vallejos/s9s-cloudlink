'use strict';

exports = module.exports = () => {

    /**
     * SubNet class
     * @property {number|string} id
     * @property {string} state
     * @property {number|string} vpcId
     * @property {string} cidr
     * @property {number} availableIps
     */
    class SubNet {

        /**
         * @param {number|string} id
         * @param {string} state
         * @param {number|string} vpcId
         * @param {string} cidr
         * @param {number} availableIps
         */
        constructor(id, state, vpcId, cidr, availableIps) {
            this.id = id;
            this.state = state;
            this.vpcId = vpcId;
            this.cidr = cidr;
            this.availableIps = availableIps;
        }

    }

    return SubNet;

};
