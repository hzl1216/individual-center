'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UObjectArray = types.UObjectArray;
const UObject = types.UObject;
const User = model.createModel('User', {
  loginName: UString(),
  password: UString(),
  session: UObject({
    type: 'Session'
  }),
  privileges: UObjectArray({
    type: 'Privilege'
  })
}, 'users');

module.exports = {
  User
};
