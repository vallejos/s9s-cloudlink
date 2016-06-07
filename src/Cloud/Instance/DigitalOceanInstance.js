'use strict';

exports = module.exports = (namespace) => {

    const BaseInstance = namespace.requireOnce('Cloud/Instance/Base/BaseInstance');

    const Ip = namespace.requireOnce('Cloud/Instance/Wrappers/Ip');
    const Region = namespace.requireOnce('Cloud/Instance/Wrappers/Region');
    const Status = namespace.requireOnce('Cloud/Instance/Wrappers/Status');

    /**
     * DigitalOcean instance class
     * @extends {BaseInstance}
     * @property {string} name
     * @property {number} vcpus
     * @property {number} memory
     * @property {number} disk
     * @property {{name:string,slug:string}} region
     */
    return class DigitalOceanInstance extends BaseInstance {

        /**
         * @param type
         * @param object
         * @returns Region
         */
        static objectToIp(type, object) {
            return new Ip(
                type,
                object.ip_address,
                object.ip_address,
                object.gateway
            );
        }

        /**
         * @inheritdoc
         */
        getId() {
            return this.id;
        }

        /**
         * @inheritdoc
         */
        getName() {
            return this.name;
        }

        /**
         * @inheritdoc
         */
        getMemory() {
            return this.memory;
        }

        /**
         * @inheritdoc
         */
        getCpu() {
            return this.vcpus;
        }

        /**
         * @inheritdoc
         */
        getDiskSpace() {
            return this.disk;
        }

        /**
         * @inheritdoc
         */
        getPublicIps() {
            return (this.networks.v4 || [])
                .filter((item) => {
                    return item.type == 'public';
                })
                .map((item) => {
                    return DigitalOceanInstance
                        .objectToIp(Ip.TYPE_PUBLIC, item);
                });
        }

        /**
         * @inheritdoc
         */
        getPrivateIps() {
            return (this.networks.v4 || [])
                .filter((item) => {
                    return item.type == 'private';
                })
                .map((item) => {
                    return DigitalOceanInstance
                        .objectToIp(Ip.TYPE_PRIVATE, item);
                });
        }

        /**
         * @inheritdoc
         */
        getRegion() {
            return new Region(
                this.region.name,
                this.region.slug
            );
        }

        /**
         * @inheritdoc
         */
        getStatus() {
            if (this.locked) {
                return new Status(Status.StatusPending);
            }
            switch (this.status) {
                case 'new':
                    return new Status(Status.StatusPending);
                case 'active':
                    return new Status(Status.StatusRunning);
                case 'off':
                    return new Status(Status.StatusShutdown);
                case 'archive':
                    return new Status(Status.StatusTerminated);
            }
            return new Status(Status.StatusUnknown);
        }

    }

};
