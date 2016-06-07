'use strict';

exports = module.exports = (namespace) => {

    /**
     * Region class
     * @property {string} name
     * @property {string} code
     * @property {string} domain
     */
    return class Region {

        /**
         * @param {string} name
         * @param {string} code
         * @param {string|null} [domain]
         */
        constructor(name, code, domain) {
            this.name = name;
            this.code = code;
            this.domain = domain || null;
        }

    }

};
