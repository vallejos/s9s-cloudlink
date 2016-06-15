'use strict';

exports = module.exports = () => {

    /**
     * Status class
     * @property {number} status
     * @property {string} code
     */
    class Status {

        /**
         * @returns {number}
         */
        static get StatusUnknown() {
            return -1;
        }

        /**
         * @returns {number}
         */
        static get StatusPending() {
            return 0;
        }

        /**
         * @returns {number}
         */
        static get StatusRunning() {
            return 1;
        }

        /**
         * @returns {number}
         */
        static get StatusShutdown() {
            return 2;
        }

        /**
         * @returns {number}
         */
        static get StatusTerminated() {
            return 3;
        }

        /**
         * @param {number} status
         */
        constructor(status) {
            this.status = status || Status.StatusUnknown;
            this.code = 'unknown';
            switch (this.status) {
                case Status.StatusPending:
                    this.code = 'pending';
                    break;
                case Status.StatusRunning:
                    this.code = 'running';
                    break;
                case Status.StatusShutdown:
                    this.code = 'shutdown';
                    break;
                case Status.StatusTerminated:
                    this.code = 'terminated';
                    break;
                case Status.StatusUnknown:
                    this.code = 'unknown';
                    break;
            }
        }

    }

    return Status;

};
