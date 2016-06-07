'use strict';

exports = module.exports = (namespace) => {

    /**
     * BaseObject class
     * @extends {Object}
     */
    return class BaseObject extends Object {

        /**
         * Describes the object that should be exported to the user
         * @returns {{}}
         */
        get jsonParams() {
            return {};
        }

        /**
         * Returns an output object
         * @returns {{}}
         */
        toJson() {
            const json = {};
            for (let param in this.jsonParams) {
                if (this.jsonParams.hasOwnProperty(param)) {
                    if (typeof this.jsonParams[param] === 'function') {
                        json[param] = this.jsonParams[param].call(this);
                    } else {
                        json[param] = this.jsonParams[param];
                    }
                }
            }
            return json;
        }

    }

};
