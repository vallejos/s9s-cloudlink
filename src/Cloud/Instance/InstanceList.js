'use strict';

exports = module.exports = (namespace) => {

    const BaseArray = namespace.requireOnce('Cloud/Base/BaseArray');

    /**
     * InstanceList class
     * @extends {BaseArray}
     */
    return class InstanceList extends BaseArray {

        /**
         * Override map method to return an InstanceList instead of Array
         * @returns {InstanceList}
         */
        map(...args) {
            return InstanceList.fromArray(
                super.map.apply(this, args)
            );
        }

        /**
         * @returns {Array|InstanceList}
         */
        toJson() {
            return this
                .map((item) => {
                    return item.toJson();
                });
        }

    }

};
