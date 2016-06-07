'use strict';

const assert = require('assert');
const CloudLink = require(__dirname + '/../../../src/CloudLink');
const BaseArray = CloudLink.namespace.requireOnce('Cloud/Base/BaseArray');

describe('Cloud/Base/BaseArray', () => {

    it('Should be an instance of Array', () => {
        const instance = new BaseArray();
        assert.strictEqual(instance instanceof Array, true, 'BaseArray is not an instance of Array');
    });

    it('Should have static fromArray method', () => {
        assert.strictEqual(typeof(BaseArray.fromArray), 'function', 'fromArray is not a function');
        const instance = BaseArray.fromArray([]);
        assert.strictEqual(instance instanceof BaseArray, true, 'instance is not an instance of BaseArray');
    });

    it('Should have a toJson method', () => {
        const instance = new BaseArray();
        assert.strictEqual(typeof(instance.toJson), 'function', 'toJson is not a function');
        assert.strictEqual(instance instanceof Array, true, 'instance is not an instance of Array');
    });

});