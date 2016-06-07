'use strict';

exports = module.exports = (namespace) => {

    /**
     * BaseArray class
     * @extends {Array}
     */
    return class BaseArray extends Array {

        /**
         * @param arr
         * @returns {BaseArray|*}
         */
        static fromArray(arr) {
            const list = new this();
            if (arr instanceof Array) {
                arr.forEach((item) => {
                    list.push(item);
                });
            }
            return list;
        }

        /**
         * @param args
         */
        constructor(...args) {
            super();
            if (args instanceof Array) {
                args.forEach((argument) => {
                    this.push(argument);
                });
            }
        }

        /**
         * @returns {Array}
         */
        toJson() {
            return super.slice.call(this);
        }

    }

};

