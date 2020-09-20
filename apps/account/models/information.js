'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;

const Information = model.createModel('Information', {
    loginName: UString(),
    name: UString(),
    orgnization: UString(),
    title: UString(),
    phone: UString()

}, 'informations');

module.exports = {
    Information
};
