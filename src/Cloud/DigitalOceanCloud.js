'use strict';

exports = module.exports = (namespace) => {

    /* eslint max-statements: ["error", 20] */

    const BaseCloud = namespace
        .requireOnce('Cloud/Base/BaseCloud');
    const InstanceList = namespace
        .requireOnce('Cloud/Instance/InstanceList');
    const DigitalOceanInstance = namespace
        .requireOnce('Cloud/Instance/DigitalOceanInstance');

    const Region = namespace
        .requireOnce('Cloud/Instance/Wrappers/Region');
    const Distribution = namespace
        .requireOnce('Cloud/Instance/Wrappers/Distribution');
    const Status = namespace
        .requireOnce('Cloud/Instance/Wrappers/Status');
    const Size = namespace
        .requireOnce('Cloud/Instance/Wrappers/Size');

    const DigitalOcean = require('do-wrapper');
    const Promise = require('promise');

    /**
     * Digitalocean wrapper class
     * @extends {BaseCloud}
     * @property {{
     *  apiKey:string,
     *  token:string,
     *  pageSize:number
     * }} config
     */
    class DigitalOceanCloud extends BaseCloud {

        /**
         * @inheritdoc
         */
        constructor(config) {
            super(config);
            if (!this.config.apiKey && !this.config.token) {
                throw new Error(`Api Key is not defined`);
            }
            this.api = new DigitalOcean(
                this.config.apiKey || this.config.token,
                this.config.pageSize || 200
            );
        }

        /**
         * @inheritdoc
         */
        addInstance({
            names = null,
            region = null,
            size = null,
            image = null,
            sshKeys = null
        } = {}) {
            return new Promise((resolve, reject) => {

                /* eslint camelcase: ["error", {properties: "never"}] */

                const params = {
                    names,
                    region,
                    size,
                    image,
                    ssh_keys: sshKeys,
                    backups: false,
                    ipv6: false,
                    user_data: null,
                    private_networking: true
                };
                this.api
                    .dropletsCreate(
                        params,

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  droplets:{},
                         *  droplet:{},
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {
                            if (error) {
                                reject(error);
                            } else if (data.droplet || data.droplets) {
                                const list = new InstanceList();
                                if (data.droplet) {
                                    list.push(
                                        new DigitalOceanInstance(data.droplet)
                                    );
                                } else {
                                    data.droplets.forEach((droplet) => {
                                        list.push(
                                            new DigitalOceanInstance(droplet)
                                        );
                                    });
                                }
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
        listInstances() {
            return new Promise((resolve, reject) => {
                // noinspection JSCheckFunctionSignatures
                this.api
                    .dropletsGetAll(
                        {},

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  droplets:{},
                         *  id:string,
                         *  message:string
                         * }} data
                         */
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
                // noinspection JSCheckFunctionSignatures
                this.api
                    .regionsGetAll(
                        {},

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  regions:{},
                         *  id:string,
                         *  message:string
                         * }} data
                         */
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
                // noinspection JSCheckFunctionSignatures
                this.api
                    .sizesGetAll(
                        {},

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  sizes:{},
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {
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
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        listDistributions({filters = {}} = {}) {
            return new Promise((resolve, reject) => {
                // noinspection JSCheckFunctionSignatures
                this.api
                    .imagesGetAll(
                        {
                            type: 'distribution'
                        },

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  images:{
                         *    distribution:string,
                         *    name:string,
                         *    slug:string
                         *  },
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {
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
                        }
                    );
            });
        }

        /**
         * This method is not implementable for DigitalOcean
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
                    .dropletsGetById(
                        instanceId,

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  droplet:{
                         *    status:string
                         *  },
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {
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
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        listKeys() {
            return new Promise((resolve, reject) => {
                // noinspection JSCheckFunctionSignatures
                this.api
                    .accountGetKeys(
                        {},

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  ssh_keys:{},
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {
                            if (error) {
                                reject(error);
                            } else if (data.ssh_keys) {
                                resolve(
                                    data.ssh_keys.map((key) => {
                                        return {
                                            id: key.id,
                                            name: key.name,
                                            fingerprint: key.fingerprint
                                        };
                                    })
                                );
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
        addKey({name = null, publicKey = null} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .accountAddKey(
                        {
                            name,
                            public_key: publicKey
                        },

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  ssh_key:{
                         *    id:number,
                         *    name:string,
                         *    fingerprint:string
                         *  },
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {
                            if (error) {
                                reject(error);
                            } else if (data.ssh_key) {
                                resolve({
                                    id: data.ssh_key.id,
                                    name: data.ssh_key.name,
                                    fingerprint: data.ssh_key.fingerprint
                                });
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
        deleteKey({id = null} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .accountDeleteKey(
                        id,

                        /**
                         * Handle api response
                         * @param error
                         * @param inMessage
                         * @param {{
                         *  id:string,
                         *  message:string
                         * }} data
                         */
                        (error, inMessage, data) => {

                            /* eslint no-negated-condition: "off" */

                            if (error) {
                                reject(error);
                            } else if (data !== undefined) {
                                reject(data.message || 'Unknown error');
                            } else {
                                resolve(true);
                            }
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        listVpcs({filters = {}, ids = []} = {}) {
            return new Promise((resolve, reject) => {
                reject('listVpcs is not supported for DigitalOcean');
            });
        }

        /**
         * @inheritdoc
         */
        addVpc({cidr = null, tenancy = 'default'} = {}) {
            return new Promise((resolve, reject) => {
                reject('addVpc is not supported for DigitalOcean');
            });
        }

    }

    return DigitalOceanCloud;

};
