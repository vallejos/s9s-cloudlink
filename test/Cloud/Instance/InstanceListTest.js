'use strict';

const assert = require('assert');
const CloudLink = require(__dirname + '/../../../src/CloudLink');
const InstanceList = CloudLink.namespace.requireOnce('Cloud/Instance/InstanceList');
const BaseArray = CloudLink.namespace.requireOnce('Cloud/Base/BaseArray');

describe('Cloud/Instance/InstanceList', () => {

    const instance = new InstanceList();

    it('Should be an instance of BaseArray', () => {
        assert.strictEqual(instance instanceof BaseArray, true, 'instance is not an instance of BaseArray');
    });

    it('Should be an instance of Array', () => {
        assert.strictEqual(instance instanceof Array, true, 'instance is not an instance of Array');
    });

    it('Should implement toJson method', () => {
        assert.strictEqual(typeof(instance.toJson), 'function', 'toJson is not a function');
    });

});
