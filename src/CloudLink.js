'use strict';

if (parseFloat(process.versions.node) < 6) {
    throw new Error('Unsupported NodeJS version, please use NodeJS 6.x or higher.');
}

/**
 * List of supported clouds (code => name)
 * @enum {string}
 */
const clouds = {
    digitalocean: 'DigitalOcean',
    aws: 'Aws'
};

const namespace = require('s9s-namespace')(__dirname);
const BaseCloud = namespace.requireOnce('Cloud/Base/BaseCloud');

/**
 * IaaS (Infrastructure as a Service) class
 */
class CloudLink {

    /**
     * @return {Namespace}
     */
    static get namespace() {
        return namespace;
    }

    /**
     * Returns a list of allowed methods
     * @returns {[]}
     */
    static get allowedMethods() {
        return Object
            .getOwnPropertyNames(BaseCloud.prototype)
            .filter((method) => {
                return method !== 'constructor';
            });
    }

    /**
     * @returns {{}}
     */
    static get allowedClouds() {
        return clouds;
    }

    /**
     * @param cloud
     * @param config
     * @returns {BaseCloud}
     */
    static factory(cloud, config) {
        const Cloud = namespace.requireOnce(`Cloud/${clouds[cloud]}Cloud`);
        return new Cloud(config);
    }

    /**
     * Checks if cloud exists
     * @param cloudCode
     * @returns {boolean}
     */
    static cloudExists(cloudCode) {
        return cloudCode in clouds;
    }

    /**
     * Checks if method exists
     * @param method
     * @returns {boolean}
     */
    static methodExists(method) {
        return CloudLink
                .allowedMethods
                .indexOf(method) !== -1;
    }

    /**
     * @param cloud
     * @param method
     * @returns {{}|null}
     */
    static methodArguments(cloud, method) {
        return namespace
            .requireOnce(`Cloud/${cloud}Cloud`)
            .getMethodArguments(method);
    }

}

exports = module.exports = CloudLink;
