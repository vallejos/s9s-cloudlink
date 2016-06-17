'use strict';

const assert = require('assert');
const Filesystem = require('s9s-filesystem');
const CloudLink = require(__dirname + '/../src/CloudLink');

/**
 * List of allowed methods for all cloud providers
 * @type {{}}
 */
const allowedMethods = Filesystem.readJson(__dirname + '/cloudMethods.json');

/**
 * List of allowed cloud providers
 * @type {{}}
 */
const allowedClouds = Filesystem.readJson(__dirname + '/clouds.json');

/**
 * Cloud configurations for building instances
 * @type {{}}
 */
const configs = {
    digitalocean: {
        apiKey: 'some_key_example'
    }
};

describe('CloudLink', () => {

    it('Should should have a namespace', () => {
        assert.notStrictEqual(CloudLink.namespace, undefined, 'namespace is not an object');
    });

    it('Should return allowed methods', () => {
        assert.strictEqual(typeof(CloudLink.allowedMethods), 'object', 'allowedMethods is not an object');
        allowedMethods
            .forEach((method) => {
                if (CloudLink.allowedMethods.indexOf(method) === -1) {
                    assert.fail(undefined, method, `Method ${method} not found in CloudLink.allowedMethods`);
                } else {
                    assert.ok(method, `Method ${method} found`);
                }
            });
    });

    it('Should return allowed clouds', () => {
        assert.strictEqual(typeof(CloudLink.allowedClouds), 'object', 'allowedClouds is not an object');
        for (let i in allowedClouds) {
            if (allowedClouds.hasOwnProperty(i)) {
                if (!(i in CloudLink.allowedClouds)) {
                    assert.fail(
                        undefined,
                        allowedClouds[i],
                        `Cloud ${allowedClouds[i]} not found in CloudLink.allowedClouds`
                    );
                } else {
                    assert.ok(`Cloud ${allowedClouds[i]} found`);
                }
                assert.strictEqual(
                    allowedClouds[i],
                    CloudLink.allowedClouds[i],
                    'Cloud name do not match'
                );
            }
        }
    });

    it('Should implement methodExists method', () => {
        assert.strictEqual(typeof(CloudLink.methodExists), 'function', 'methodExists is not a function');
        assert.strictEqual(CloudLink.methodExists('listInstances'), true, 'Known method not found');
        assert.strictEqual(CloudLink.methodExists('unknownMethod'), false, 'Unknown method found');
    });

    it('Should implement cloudExists method', () => {
        assert.strictEqual(typeof(CloudLink.cloudExists), 'function', 'cloudExists is not a function');
        assert.strictEqual(CloudLink.cloudExists('digitalocean'), true, 'Known cloud not found');
        assert.strictEqual(CloudLink.cloudExists('unknownCloud'), false, 'Unknown cloud found');
    });

    it('Should return method arguments', () => {
        assert.strictEqual(typeof(CloudLink.methodArguments), 'function', 'methodArguments is not a function');
        assert.strictEqual(CloudLink.methodArguments('DigitalOcean', 'listInstances'), null);
        const args = CloudLink.methodArguments('DigitalOcean', 'getInstanceStatus');
        assert.strictEqual(args instanceof Object, true, 'args is not an object');
        assert.strictEqual('instanceId' in args, true, 'instanceId not found in args');
        assert.strictEqual(typeof(args.instanceId), 'object', 'args type is not an object');
    });

    it('Should have a factory', () => {
        assert.strictEqual(typeof(CloudLink.factory), 'function', 'factory is not a function');
        for (let code in configs) {
            if (configs.hasOwnProperty(code)) {
                const instance = CloudLink.factory(code, configs[code]);
                const Cloud = CloudLink.namespace.requireOnce(`Cloud/${allowedClouds[code]}Cloud`);
                assert.strictEqual(instance instanceof Cloud, true, `Failed to load cloud instance by code ${code}`);
            }
        }
    });

});