'use strict';

exports = module.exports = (namespace) => {

    /**
     * Size class
     */
    return class Size {

        /**
         * @param code
         * @param cpu
         * @param memory
         * @param disk
         */
        constructor(code, cpu, memory, disk) {
            this.code = code;
            this.cpu = cpu;
            this.memory = memory;
            this.disk = disk;
        }

    }

};
