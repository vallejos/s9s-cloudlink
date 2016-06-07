'use strict';

exports = module.exports = (namespace) => {

    const BaseCloud = namespace.requireOnce('Cloud/Base/BaseCloud');
    const InstanceList = namespace.requireOnce('Cloud/Instance/InstanceList');
    const DigitalOceanInstance = namespace.requireOnce('Cloud/Instance/DigitalOceanInstance');

    const Region = namespace.requireOnce('Cloud/Instance/Wrappers/Region');
    const Distribution = namespace.requireOnce('Cloud/Instance/Wrappers/Distribution');
    const Status = namespace.requireOnce('Cloud/Instance/Wrappers/Status');
    const Size = namespace.requireOnce('Cloud/Instance/Wrappers/Size');

    const DigitalOcean = require('do-wrapper');
    const Promise = require('promise');

    /**
     * Digitalocean wrapper class
     * @extends {BaseCloud}
     */
    return class DigitalOceanCloud extends BaseCloud {

        /**
         * @inheritdoc
         */
        constructor(config) {
            super(config);
            if (!this.config.apiKey) {
                throw new Error(`Api Key is not defined`);
            }
            this.api = new DigitalOcean(
                this.config.apiKey,
                this.config.pageSize || 200
            );
        }

        /**
         * @inheritdoc
         */
        addInstance({params = {}} = {}) {
        }

        /**
         * @inheritdoc
         */
        listInstances() {
            return new Promise((resolve, reject) => {
                this.api
                    .dropletsGetAll(
                        {},
                        (error, inMessage, data) => {
                            if (error) {
                                reject(error);
                            } else if (data.droplets) {
                                const list = new InstanceList();
                                data.droplets
                                    .forEach((droplet) => {
                                        list.push(new DigitalOceanInstance(droplet));
                                    });
                                resolve(list);
                            } else {
                                reject(data.message || 'Unknown error');
                            }
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        listRegions() {
            return new Promise((resolve, reject) => {
                this.api
                    .regionsGetAll(
                        {},
                        (error, inMessage, data) => {
                            if (error) {
                                reject(error);
                            } else if (data.regions) {
                                const regions = [];
                                data.regions
                                    .forEach((region) => {
                                        regions.push(new Region(
                                            region.name,
                                            region.slug
                                        ));
                                    });
                                resolve(regions);
                            } else {
                                reject(data.message || 'Unknown error');
                            }
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        listSizes() {
            return new Promise((resolve, reject) => {
                this.api
                    .sizesGetAll({}, (error, inMessage, data) => {
                        if (error) {
                            reject(error);
                        } else if (data.sizes) {
                            const sizes = [];
                            data.sizes
                                .forEach((size) => {
                                    sizes.push(new Size(
                                        size.slug,
                                        size.vcpus,
                                        size.memory,
                                        size.disk
                                    ));
                                });
                            resolve(sizes);
                        } else {
                            reject(data.message || 'Unknown error');
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        listDistributions({filters = {}} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .imagesGetAll({
                        type: 'distribution'
                    }, (error, inMessage, data) => {
                        if (error) {
                            reject(error);
                        } else if (data.images) {
                            resolve(
                                (data.images || []).map((image) => {
                                    return new Distribution(
                                        image.id,
                                        [image.distribution, image.name].join(' '),
                                        image.slug
                                    );
                                })
                            );
                        } else {
                            reject(data.message || 'Unknown error');
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        listVolumes() {
            return new Promise((resolve, reject) => {
                reject('listVolumes is not supported for DigitalOcean');
            });
        }

        /**
         * @inheritdoc
         */
        getInstanceStatus({instanceId:instanceId} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .dropletsGetById(instanceId, (error, inMessage, data) => {
                        if (error) {
                            reject(error);
                        } else if (data.droplet && data.droplet.status) {
                            let result = new Status(Status.StatusUnknown);
                            switch (data.droplet.status) {
                                case 'new':
                                    result = new Status(Status.StatusPending);
                                    break;
                                case 'active':
                                    result = new Status(Status.StatusRunning);
                                    break;
                                case 'off':
                                    result = new Status(Status.StatusShutdown);
                                    break;
                                case 'archive':
                                    result = new Status(Status.StatusTerminated);
                                    break;
                            }
                            resolve(result);
                        } else {
                            reject(data.message || 'Unknown error');
                        }
                    });
            });
        }

    }

};
