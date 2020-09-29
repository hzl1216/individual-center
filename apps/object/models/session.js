'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;

const Session = model.createModel('Session', {
    sessionId: UString(),
    loginName: UString()
}, 'sessions');

module.exports = {
    Session
};
