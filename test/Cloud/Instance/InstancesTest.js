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
        const Instance= CloudLink.namespace.requireOnce(`Cloud/Instance/${clouds[i]}Instance`);
        const instance = new Instance;
    }
}
