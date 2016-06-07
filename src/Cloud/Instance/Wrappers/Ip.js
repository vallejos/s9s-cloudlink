'use strict';

exports = module.exports = (namespace) => {

    /**
     * Ip class
     */
    return class Ip {

        /**
         * @returns {number}
         */
        static get TYPE_PRIVATE() {
            return 1;
        }

        /**
         * @returns {number}
         */
        static get TYPE_PUBLIC() {
            return 2;
        }

        /**
         * @param type
         * @param ip
         * @param netmask
         * @param gateway
         */
        constructor(type, ip, netmask, gateway) {
            this.type = type;
            this.ip = ip;
            this.netmask = netmask;
            this.gateway = gateway;
        }

    }

};
