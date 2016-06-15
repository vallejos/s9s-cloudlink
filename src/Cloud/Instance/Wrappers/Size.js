'use strict';

exports = module.exports = () => {

    /**
     * Size class
     * @property {string} code
     * @property {number} cpu
     * @property {number} memory
     * @property {number} disk
     */
    class Size {

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

    return Size;

};
