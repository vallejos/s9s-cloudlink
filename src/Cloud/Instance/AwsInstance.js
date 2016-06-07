'use strict';

exports = module.exports = (namespace) => {

    const BaseInstance = namespace.requireOnce('Cloud/Instance/Base/BaseInstance');

    const Ip = namespace.requireOnce('Cloud/Instance/Wrappers/Ip');
    const Region = namespace.requireOnce('Cloud/Instance/Wrappers/Region');
    const Status = namespace.requireOnce('Cloud/Instance/Wrappers/Status');

    /**
     * AwsInstance class
     * @extends {BaseInstance}
     */
    return class AwsInstance extends BaseInstance {

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
            return this.InstanceId;
        }

        /**
         * @inheritdoc
         */
        getName() {
            let name = this.InstanceId;
            if (this.Tags) {
                this.Tags
                    .forEach((tag) => {
                        if (tag.Key == 'Name') {
                            name = tag.Value;
                        }
                    });
            }
            return name;
        }

        /**
         * @inheritdoc
         */
        getCpu() {
            return (AwsInstance.instanceTypes[this.InstanceType] || {}).cpu || null;
        }

        /**
         * @inheritdoc
         */
        getMemory() {
            return (AwsInstance.instanceTypes[this.InstanceType] || {}).memory || null;
        }

        /**
         * @inheritdoc
         */
        getDiskSpace() {
            return this.TotalDiskSpace;
        }

        /**
         * @inheritdoc
         */
        getPublicIps() {
            const ips = [];
            if (this.NetworkInterfaces) {
                this.NetworkInterfaces
                    .forEach((networkInterface) => {
                        if (networkInterface.Association) {
                            ips.push(new Ip(
                                Ip.TYPE_PUBLIC,
                                networkInterface.Association.PublicIp,
                                null,
                                null
                            ));
                        }
                    });
            }
            return ips;
        }

        /**
         * @inheritdoc
         */
        getPrivateIps() {
            const ips = [];
            if (this.NetworkInterfaces) {
                this.NetworkInterfaces
                    .forEach((networkInterface) => {
                        if (networkInterface.PrivateIpAddresses) {
                            networkInterface.PrivateIpAddresses
                                .forEach((address) => {
                                    ips.push(new Ip(
                                        Ip.TYPE_PRIVATE,
                                        address.PrivateIpAddress,
                                        null,
                                        null
                                    ));
                                });
                        }
                    });
            }
            return ips;
        }

        /**
         * @inheritdoc
         */
        getRegion() {
            return new Region(
                this.Placement.AvailabilityZone,
                this.Placement.AvailabilityZone
            );
        }

        /**
         * @inheritdoc
         */
        getStatus() {
            switch (this.State.Name) {
                case 'pending':
                    return new Status(Status.StatusPending);
                case 'running':
                    return new Status(Status.StatusRunning);
                case 'shutting-down':
                    return new Status(Status.StatusShutdown);
                case 'terminated':
                    return new Status(Status.StatusTerminated);
                case 'stopping':
                    return new Status(Status.StatusShutdown);
                case 'stopped':
                    return new Status(Status.StatusShutdown);
            }
            return new Status(Status.StatusUnknown);
        }

        /**
         * Contains description for amount of cpus and memory per instance type
         * @returns {{}}
         * @static
         */
        static get instanceTypes() {
            return {
                't2.nano': {
                    available: true,
                    cpu: 1,
                    memory: 0.5
                },
                't2.micro': {
                    available: true,
                    cpu: 1,
                    memory: 1
                },
                't2.small': {
                    available: true,
                    cpu: 1,
                    memory: 2
                },
                't2.medium': {
                    available: true,
                    cpu: 2,
                    memory: 4
                },
                't2.large': {
                    available: true,
                    cpu: 2,
                    memory: 8
                },
                'm4.large': {
                    available: true,
                    cpu: 2,
                    memory: 8
                },
                'm4.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 16
                },
                'm4.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 32
                },
                'm4.4xlarge': {
                    available: true,
                    cpu: 16,
                    memory: 64
                },
                'm4.10xlarge': {
                    available: true,
                    cpu: 40,
                    memory: 160
                },
                'm3.medium': {
                    available: true,
                    cpu: 1,
                    memory: 3.75
                },
                'm3.large': {
                    available: true,
                    cpu: 2,
                    memory: 7.5
                },
                'm3.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 15
                },
                'm3.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 30
                },
                'c4.large': {
                    available: true,
                    cpu: 2,
                    memory: 3.75
                },
                'c4.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 7.5
                },
                'c4.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 15
                },
                'c4.4xlarge': {
                    available: true,
                    cpu: 16,
                    memory: 30
                },
                'c4.8xlarge': {
                    available: true,
                    cpu: 36,
                    memory: 60
                },
                'c3.large': {
                    available: true,
                    cpu: 2,
                    memory: 3.75
                },
                'c3.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 7.5
                },
                'c3.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 15
                },
                'c3.4xlarge': {
                    available: true,
                    cpu: 16,
                    memory: 30
                },
                'c3.8xlarge': {
                    available: true,
                    cpu: 32,
                    memory: 60
                },
                'g2.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 15
                },
                'g2.8xlarge': {
                    available: true,
                    cpu: 32,
                    memory: 60
                },
                'x1.32xlarge': {
                    available: true,
                    cpu: 128,
                    memory: 1952
                },
                'r3.large': {
                    available: true,
                    cpu: 2,
                    memory: 15.25
                },
                'r3.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 30.5
                },
                'r3.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 61
                },
                'r3.4xlarge': {
                    available: true,
                    cpu: 16,
                    memory: 122
                },
                'r3.8xlarge': {
                    available: true,
                    cpu: 32,
                    memory: 244
                },
                'i2.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 30.5
                },
                'i2.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 61
                },
                'i2.4xlarge': {
                    available: true,
                    cpu: 16,
                    memory: 122
                },
                'i2.8xlarge': {
                    available: true,
                    cpu: 32,
                    memory: 244
                },
                'd2.xlarge': {
                    available: true,
                    cpu: 4,
                    memory: 30.5
                },
                'd2.2xlarge': {
                    available: true,
                    cpu: 8,
                    memory: 61
                },
                'd2.4xlarge': {
                    available: true,
                    cpu: 16,
                    memory: 122
                },
                'd2.8xlarge': {
                    available: true,
                    cpu: 36,
                    memory: 244
                },

                // Previous Generation Instance Details & Pricing
                'm1.small': {
                    available: false,
                    cpu: 1,
                    memory: 1.7
                },
                'm1.medium': {
                    available: false,
                    cpu: 1,
                    memory: 3.75
                },
                'm1.large': {
                    available: false,
                    cpu: 2,
                    memory: 7.5
                },
                'm1.xlarge': {
                    available: false,
                    cpu: 4,
                    memory: 15
                },
                'c1.medium': {
                    available: false,
                    cpu: 2,
                    memory: 1.7
                },
                'c1.xlarge': {
                    available: false,
                    cpu: 8,
                    memory: 7
                },
                'cc2.8xlarge': {
                    available: false,
                    cpu: 32,
                    memory: 60.5
                },
                'cg1.4xlarge': {
                    available: false,
                    cpu: 16,
                    memory: 22.5
                },
                'm2.xlarge': {
                    available: false,
                    cpu: 2,
                    memory: 17.1
                },
                'm2.2xlarge': {
                    available: false,
                    cpu: 4,
                    memory: 34.2
                },
                'm2.4xlarge': {
                    available: false,
                    cpu: 8,
                    memory: 68.4
                },
                'cr1.8xlarge': {
                    available: false,
                    cpu: 32,
                    memory: 244
                },
                'hi1.4xlarge': {
                    available: false,
                    cpu: 16,
                    memory: 60.5
                },
                'hs1.8xlarge': {
                    available: false,
                    cpu: 16,
                    memory: 117
                },
                't1.micro': {
                    available: false,
                    cpu: 1,
                    memory: 0.613
                }
            };
        }

    }

};
