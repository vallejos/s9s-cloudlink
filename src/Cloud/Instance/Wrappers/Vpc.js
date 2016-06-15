'use strict';

exports = module.exports = () => {

    /**
     * Vpc class
     * @property {number|string} id
     * @property {string} name
     * @property {string} state
     * @property {string} cidr
     * @property {string} tenancy
     * @property {boolean} isDefault
     */
    class Vpc {

        /**
         * @param {number|string} id
         * @param {string} name
         * @param {string} state
         * @param {string} cidr
         * @param {string} tenancy
         * @param {boolean} isDefault
         */
        constructor(id, name, state, cidr, tenancy, isDefault) {
            this.id = id;
            this.name = name;
            this.state = state;
            this.cidr = cidr;
            this.tenancy = tenancy;
            this.isDefault = isDefault;
        }

    }

    return Vpc;

};
