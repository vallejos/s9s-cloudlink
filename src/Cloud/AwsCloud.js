'use strict';

exports = module.exports = (namespace) => {

    const BaseCloud = namespace.requireOnce('Cloud/Base/BaseCloud');
    const InstanceList = namespace.requireOnce('Cloud/Instance/InstanceList');
    const AwsInstance = namespace.requireOnce('Cloud/Instance/AwsInstance');

    const Region = namespace.requireOnce('Cloud/Instance/Wrappers/Region');
    const Distribution = namespace.requireOnce('Cloud/Instance/Wrappers/Distribution');
    const Status = namespace.requireOnce('Cloud/Instance/Wrappers/Status');
    const Size = namespace.requireOnce('Cloud/Instance/Wrappers/Size');

    const Aws = require('aws-sdk');
    const Promise = require('promise');

    /**
     * AwsCloud class
     * @extends {BaseCloud}
     */
    return class AwsCloud extends BaseCloud {

        /**
         * @inheritdoc
         */
        constructor(config) {
            super(config);
            Aws.config.update({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                region: config.region
            });
            this.api = new Aws.EC2({});
        }

        /**
         * @inheritdoc
         */
        addInstance({params = {}} = {}) {
        }

        /**
         * Returns a promise with a list of volumes
         * @returns {Promise}
         */
        listVolumes() {
            return new Promise((resolve, reject) => {
                this.api
                    .describeVolumes({}, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data.Volumes || []);
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        listInstances() {
            const list = new InstanceList();
            const promise = new Promise((resolve, reject) => {
                this.api
                    .describeInstances((error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            if (data.Reservations) {
                                data.Reservations
                                    .forEach((reservation) => {
                                        if (reservation.Instances) {
                                            reservation.Instances
                                                .forEach((instance) => {
                                                    list.push(new AwsInstance(instance));
                                                });
                                        }
                                    });
                            }
                            resolve(list);
                        }
                    });
            });
            return promise
                .then(() => {
                    return this
                        .listVolumes();
                })
                .then((volumes) => {
                    return list
                        .map((instance) => {
                            let total = 0;
                            if (instance.BlockDeviceMappings) {
                                instance.BlockDeviceMappings
                                    .forEach((block) => {
                                        if (block.Ebs) {
                                            volumes.forEach((volume) => {
                                                if (block.Ebs.VolumeId == volume.VolumeId) {
                                                    total += parseInt(volume.Size);
                                                }
                                            });
                                        }
                                    });
                            }
                            instance.TotalDiskSpace = total;
                            return instance;
                        });
                });
        }

        /**
         * @inheritdoc
         */
        listRegions() {
            return new Promise((resolve, reject) => {
                this.api
                    .describeRegions((error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            const regions = [];
                            if (data.Regions) {
                                data.Regions
                                    .forEach((region) => {
                                        regions.push(new Region(
                                            region.RegionName,
                                            region.RegionName,
                                            region.Endpoint
                                        ));
                                    })
                            }
                            resolve(regions);
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        listSizes() {
            return new Promise((resolve) => {
                const sizes = [];
                for (let i in AwsInstance.instanceTypes) {
                    if (AwsInstance.instanceTypes.hasOwnProperty(i)) {
                        sizes.push(new Size(
                            i,
                            AwsInstance.instanceTypes[i].cpu,
                            AwsInstance.instanceTypes[i].memory * 1024,
                            null
                        ));
                    }
                }
                resolve(sizes);
            });
        }

        /**
         * @inheritdoc
         */
        listDistributions({filters = {}} = {}) {
            const requestFilters = [
                {
                    Name: 'architecture',
                    Values: ['x86_64']
                },
                {
                    Name: 'state',
                    Values: ['available']
                },
                {
                    Name: 'is-public',
                    Values: ['true']
                }
            ];

            for (let filter in filters) {
                if (filters.hasOwnProperty(filter)) {
                    if (!(filters[filter] instanceof Array)) {
                        filters[filter] = [filters[filter]];
                    }
                    requestFilters.push({
                        Name: filter,
                        Values: filters[filter]
                    });
                }
            }

            return new Promise((resolve, reject) => {
                this.api
                    .describeImages({
                        Filters: requestFilters
                    }, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(
                                (data.Images || []).map((image) => {
                                    return new Distribution(
                                        image.ImageId,
                                        image.Name,
                                        image.ImageId
                                    );
                                })
                            );
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        getInstanceStatus({instanceId:instanceId} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .describeInstanceStatus({
                        InstanceIds: [instanceId]
                    }, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            let result = new Status(Status.StatusUnknown);
                            if (data.InstanceStatuses && data.InstanceStatuses.length > 0) {
                                switch (data.InstanceStatuses[0].InstanceState.Name) {
                                    case 'pending':
                                        result = new Status(Status.StatusPending);
                                        break;
                                    case 'running':
                                        result = new Status(Status.StatusRunning);
                                        break;
                                    case 'shutting-down':
                                        result = new Status(Status.StatusShutdown);
                                        break;
                                    case 'terminated':
                                        result = new Status(Status.StatusTerminated);
                                        break;
                                    case 'stopping':
                                        result = new Status(Status.StatusShutdown);
                                        break;
                                    case 'stopped':
                                        result = new Status(Status.StatusShutdown);
                                        break;
                                }
                            }
                            resolve(result);
                        }
                    });
            });
        }

    }

};
