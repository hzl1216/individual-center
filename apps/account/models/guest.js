'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UObjectArray = types.UObjectArray;
const UObject = types.UObject;
const UDateTime = types.UDateTime;
const Guest = model.createModel('Guest', {
  loginName: UString(),
  email: UString(),
  password: UString(),
  code: UString(),
  date: UDateTime(),
  informations: UObjectArray({
    type: 'Information'
  }),
  session: UObject({
    type: 'Session'
  }),
  privileges: UObjectArray({
    type: 'Privilege'
  })
}, 'guests');

module.exports = {
  Guest
};
