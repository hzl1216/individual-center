'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const Param = model.createModel('Param', {
  type: UString(),
  name: UString(),
  value: UString(),
  default: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'params');

module.exports = {
    Param
};