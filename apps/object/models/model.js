'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;
const UObjectArray = types.UObjectArray;
const Model = model.createModel('Model', {
  username: UString(),
  objectId: UString(),
  url: UString(),
  name: UString(),
  description: UString(),
  type: UString(),
  status: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime(),
  inputparams: UObjectArray({
    type: 'Param'
  }),
  outparams: UObjectArray({
    type: 'Param'
  }),
}, 'models');

module.exports = {
    Model
};