'use strict';

const assert = require('assert');
const Filesystem = require('s9s-filesystem');
const clouds = Filesystem.readJson(__dirname + '/../../clouds.json');
const instanceMethods = Filesystem.readJson(__dirname + '/../../instanceMethods.json');
const CloudLink = require(__dirname + '/../../../src/CloudLink');
const InstanceMethodNotImplementedError = CloudLink.namespace
    .requireOnce('Cloud/Instance/InstanceMethodNotImplementedError');


for (let i in clouds) {
    if (clouds.hasOwnProperty(i)) {
        describe(`Cloud/Instance/${clouds[i]}Instance`, () => {
            const Instance = CloudLink.namespace
                .requireOnce(`Cloud/Instance/${clouds[i]}Instance`);
            const InstanceMethodNotImplementedError = CloudLink.namespace
                .requireOnce('Cloud/Instance/InstanceMethodNotImplementedError');
            const config = Filesystem.readJson(__dirname + `/../../${clouds[i]}Instance.json`);
            const instance = new Instance(config);
            instanceMethods
                .forEach((method) => {
                    it(`Should implement ${method}`, () => {
                        assert.strictEqual(typeof(instance[method]), 'function', `${method} is not implemented`);
                    });
                    it(`Should not throw InstanceMethodNotImplementedError`, () => {
                        assert.doesNotThrow(
                            () => {
                                instance[method]();
                            },
                            InstanceMethodNotImplementedError,
                            `InstanceMethodNotImplementedError thrown in ${clouds[i]}::${method}`
                        );
                    });
                });
        });


    }
}
