'use strict';

const assert = require('assert');
const Filesystem = require('s9s-filesystem');
const clouds = Filesystem.readJson(__dirname + '/../clouds.json');
const cloudMethods = Filesystem.readJson(__dirname + '/../cloudMethods.json');
const configs = Filesystem.readJson(__dirname + '/../config.json');
const CloudLink = require(__dirname + '/../../src/CloudLink');
const CloudMethodNotImplementedError = CloudLink.namespace.requireOnce('Cloud/CloudMethodNotImplementedError');

for (let i in clouds) {
    if (clouds.hasOwnProperty(i)) {
        const cloud = CloudLink.factory(i, configs[i]);
        describe(`Cloud/${clouds[i]}Cloud`, () => {
            cloudMethods.forEach((method) => {
                it(`Should implement ${method}`, () => {
                    assert.strictEqual(typeof(cloud[method]), 'function', `${method} is not a function`);
                });
                it(`Should not throw CloudMethodNotImplementedError`, () => {
                    assert.doesNotThrow(
                        () => {
                            cloud[method]();
                        },
                        CloudMethodNotImplementedError,
                        `CloudMethodNotImplementedError thrown in ${clouds[i]}::${method}`
                    );
                });
            });
        });
    }
}
