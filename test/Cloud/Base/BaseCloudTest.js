'use strict';

const assert = require('assert');
const Filesystem = require('s9s-filesystem');
const CloudLink = require(__dirname + '/../../../src/CloudLink');
const BaseCloud = CloudLink.namespace.requireOnce('Cloud/Base/BaseCloud');

/**
 * List of allowed methods for all cloud providers
 * @type {{}}
 */
const allowedMethods = Filesystem.readJson(__dirname + '/../../cloudMethods.json');

describe('Cloud/Base/BaseCloud', () => {

    it('Should implement static getMethodArguments method', () => {
        assert.strictEqual(typeof(BaseCloud.getMethodArguments), 'function', 'getMethodArguments is not a function');
        assert.strictEqual(typeof(BaseCloud.getMethodArguments('addInstance')), 'object', 'addInstance arguments is not an object');
        assert.strictEqual(BaseCloud.getMethodArguments('unknownMethod'), null, 'unknownMethod should be null');
    });

    const instance = new BaseCloud();
    allowedMethods.forEach((method) => {
        it(`Should implement ${method}`, () => {
            assert.strictEqual(typeof(instance[method]), 'function', `Method ${method} not found`);
        });
    });

});
