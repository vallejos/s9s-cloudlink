'use strict';

const assert = require('assert');
const CloudLink = require(__dirname + '/../../../src/CloudLink');
const BaseObject = CloudLink.namespace.requireOnce('Cloud/Base/BaseObject');

describe('Cloud/Base/BaseObject', () => {

    it('Should implement jsonParams property', () => {
        assert.strictEqual(typeof((new BaseObject()).jsonParams), 'object', 'jsonParams is not an object');
    });

    it('Should have a toJson method', () => {
        const instance = new BaseObject();
        assert.strictEqual(typeof(instance.toJson), 'function', 'toJson is not a function');
        assert.strictEqual(instance instanceof Object, true, 'instance is not an instance of Object');
    });

});
