'use strict';

const assert = require('assert');
const Filesystem = require('s9s-filesystem');
const CloudLink = require(__dirname + '/../../../../src/CloudLink');
const BaseInstance = CloudLink.namespace.requireOnce('Cloud/Instance/Base/BaseInstance');
const BaseObject = CloudLink.namespace.requireOnce('Cloud/Base/BaseObject');

describe('Cloud/Instance/Base/BaseInstance', () => {

    const instance = new BaseInstance();
    const methods = Filesystem.readJson(__dirname + '/../../../instanceMethods.json');

    it('Should be an instance of BaseObject', () => {
        assert.strictEqual(instance instanceof BaseObject, true, 'instance is not an instance of BaseObject');
    });

    it('Should be an instance of Object', () => {
        assert.strictEqual(instance instanceof Object, true, 'instance is not an instance of Object');
    });

    it('Should implement jsonParams property', () => {
        assert.strictEqual(typeof(instance.jsonParams), 'object', 'jsonParams is not an object');
    });

    methods.forEach((method) => {
        it(`Should implement ${method} method`, () => {
            assert.strictEqual(typeof(instance[method]), 'function', `${method} is not implemented`);
        });
    });

});
