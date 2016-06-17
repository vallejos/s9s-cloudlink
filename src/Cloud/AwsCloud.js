'use strict';

exports = module.exports = (namespace) => {

    /* eslint max-statements: ["error", 20] */

    const BaseCloud = namespace.requireOnce('Cloud/Base/BaseCloud');
    const InstanceList = namespace.requireOnce('Cloud/Instance/InstanceList');
    const AwsInstance = namespace.requireOnce('Cloud/Instance/AwsInstance');

    const Region = namespace.requireOnce('Cloud/Instance/Wrappers/Region');
    const Distribution = namespace.requireOnce('Cloud/Instance/Wrappers/Distribution');
    const Status = namespace.requireOnce('Cloud/Instance/Wrappers/Status');
    const Size = namespace.requireOnce('Cloud/Instance/Wrappers/Size');
    const Vpc = namespace.requireOnce('Cloud/Instance/Wrappers/Vpc');
    const SubNet = namespace.requireOnce('Cloud/Instance/Wrappers/SubNet');

    const Aws = require('aws-sdk');
    const Promise = require('promise');

    /**
     * AwsCloud class
     * @extends {BaseCloud}
     * @property {Aws.EC2|{
     *  runInstances:function,
     *  describeVolumes:function,
     *  describeInstances:function,
     *  describeRegions:function,
     *  describeImages:function,
     *  describeInstanceStatus:function,
     *  describeKeyPairs:function,
     *  importKeyPair:function,
     *  deleteKeyPair:function,
     *  createVpc:function,
     *  createSubnet:function,
     *  createTags:function,
     *  describeVpcs:function,
     *  describeSubnets:function
     * }} api
     */
    class AwsCloud extends BaseCloud {

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
        addInstance({
            names = null,
            region = null,
            size = null,
            image = null,
            sshKeys = null
        } = {}) {
            return new Promise((resolve, reject) => {

                this
                    .addVpc({
                        cidr: '10.0.0.0/16'
                    })
                    .then((vpc) => {
                        return this
                            .addSubNet({
                                cidr: '10.0.0.0/16',
                                vpcId: vpc.id
                            });
                    })
                    .then((subnet) => {

                        const params = {
                            ImageId: image,
                            InstanceType: size,
                            MinCount: 1,
                            MaxCount: names.length,
                            KeyName: sshKeys[0],
                            Monitoring: {
                                Enabled: false
                            },
                            InstanceInitiatedShutdownBehavior: 'stop',
                            DisableApiTermination: false,
                            BlockDeviceMappings: [
                                {
                                    DeviceName: '/dev/sdh',
                                    Ebs: {
                                        DeleteOnTermination: true,
                                        Encrypted: true,
                                        VolumeSize: 8,
                                        VolumeType: 'standard'
                                    }
                                }
                            ],
                            NetworkInterfaces: [
                                {
                                    DeviceIndex: 0,
                                    AssociatePublicIpAddress: true,
                                    DeleteOnTermination: true,
                                    SubnetId: subnet.id
                                }
                            ]
                        };
                        this.api
                            .runInstances(params, (error, data) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    const list = new InstanceList();
                                    (data.Instances || [])
                                        .forEach((instance) => {
                                            list.push(
                                                new AwsInstance(instance)
                                            );
                                        });
                                    resolve(list);
                                }
                            });

                    })
                    .catch(reject);
            });
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

        /**
         * @inheritdoc
         */
        listKeys() {
            return new Promise((resolve, reject) => {
                this.api
                    .describeKeyPairs({}, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(
                                (data.KeyPairs || []).map((key) => {
                                    return {
                                        id: key.KeyName,
                                        name: key.KeyName,
                                        fingerprint: key.KeyFingerprint
                                    }
                                })
                            );
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        addKey({name = null, publicKey = null} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .importKeyPair({
                        KeyName: name,
                        PublicKeyMaterial: publicKey
                    }, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({
                                id: data.KeyName,
                                name: data.KeyName,
                                fingerprint: data.KeyFingerprint
                            });
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        deleteKey({id = null} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .deleteKeyPair({
                        KeyName: id
                    }, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(true);
                        }
                    });
            });
        }

        /**
         * @inheritdoc
         */
        listVpcs({filters = {}, ids = []} = {}) {
            return new Promise((resolve, reject) => {
                const request = {};
                for (let filter in filters) {
                    if (filters.hasOwnProperty(filter)) {
                        if (!request.Filters) {
                            request.Filters = [];
                        }
                        let filterValue = null;
                        if (filters[filter] instanceof Array) {
                            filterValue = filters[filter];
                        } else {
                            filterValue = [filters[filter]];
                        }
                        request.Filters.push({
                            Name: filter,
                            Values: filterValue
                        });
                    }
                }
                if (ids instanceof Array && ids.length > 0) {
                    request.VpcIds = ids;
                }
                this.api
                    .describeVpcs(
                        request,

                        /**
                         *
                         * @param error
                         * @param data
                         */
                        (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                const list = [];
                                if (data.Vpcs && data.Vpcs instanceof Array) {
                                    data.Vpcs.forEach((vpc) => {
                                        let name = null;
                                        if (data.Tags && data.Tags instanceof Array) {
                                            data.Tags.forEach((tag) => {
                                                if (tag.Name === 'Name') {
                                                    name = tag.Value;
                                                }
                                            });
                                        }
                                        list.push(new Vpc(
                                            vpc.VpcId,
                                            name || vpc.VpcId,
                                            vpc.State,
                                            vpc.CidrBlock,
                                            vpc.InstanceTenancy,
                                            vpc.IsDefault
                                        ));
                                    });
                                }
                                resolve(list);
                            }
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        addVpc({cidr = null, tenancy = 'default'} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .createVpc(
                        {
                            CidrBlock: cidr,
                            InstanceTenancy: tenancy
                        },
                        (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({
                                    id: data.Vpc.VpcId,
                                    state: data.Vpc.State,
                                    cidr: data.Vpc.CidrBlock,
                                    dhcpOptions: data.Vpc.DhcpOptionsId,
                                    tenancy: data.Vpc.InstanceTenancy
                                });
                            }
                        }
                    )
            });
        }

        /**
         * @inheritdoc
         */
        listSubNets({filters = {}, ids = []} = {}) {
            return new Promise((resolve, reject) => {
                const request = {};
                for (let filter in filters) {
                    if (filters.hasOwnProperty(filter)) {
                        if (!request.Filters) {
                            request.Filters = [];
                        }
                        let filterValue = null;
                        if (filters[filter] instanceof Array) {
                            filterValue = filters[filter];
                        } else {
                            filterValue = [filters[filter]];
                        }
                        request.Filters.push({
                            Name: filter,
                            Values: filterValue
                        });
                    }
                }
                if (ids instanceof Array && ids.length > 0) {
                    request.VpcIds = ids;
                }
                this.api
                    .describeSubnets(
                        request,

                        /**
                         *
                         * @param error
                         * @param data
                         */
                        (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                const list = [];
                                if (data.Subnets && data.Subnets instanceof Array) {
                                    data.Subnets.forEach((subNet) => {
                                        list.push(new SubNet(
                                            subNet.SubnetId,
                                            subNet.State,
                                            subNet.VpcId,
                                            subNet.CidrBlock,
                                            subNet.AvailableIpAddressCount
                                        ));
                                    });
                                }
                                resolve(list);
                            }
                        }
                    );
            });
        }

        /**
         * @inheritdoc
         */
        addSubNet({cidr = null, vpcId = null} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .createSubnet(
                        {
                            CidrBlock: cidr,
                            VpcId: vpcId
                        },
                        (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({
                                    id: data.Subnet.SubnetId,
                                    state: data.Subnet.State,
                                    vpcIc: data.Subnet.VpcId,
                                    cidr: data.Subnet.CidrBlock
                                });
                            }
                        }
                    )
            });
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Creates tags for resources
         * @param {[]} resources
         * @param {[]} tags
         * @returns {Promise}
         */
        createTags({resources = [], tags = []} = {}) {
            return new Promise((resolve, reject) => {
                this.api
                    .createTags(
                        {
                            Resources: resources,
                            Tags: tags
                        },
                        (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        }
                    )
            });
        }
    }

    return AwsCloud;

};
