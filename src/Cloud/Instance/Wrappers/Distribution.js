'use strict';

exports = module.exports = () => {

    /**
     * Distribution class
     * @property {number|string} id
     * @property {string} name
     * @property {string} code
     */
    class Distribution {

        /**
         * @param id
         * @param name
         * @param code
         */
        constructor(id, name, code) {
            this.id = id;
            this.name = name;
            this.code = code;
        }

    }

    return Distribution;

};
