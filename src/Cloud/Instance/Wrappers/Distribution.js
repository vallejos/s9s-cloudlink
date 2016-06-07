'use strict';

exports = module.exports = (namespace) => {

    /**
     * Distribution class
     */
    return class Distribution {

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

}
