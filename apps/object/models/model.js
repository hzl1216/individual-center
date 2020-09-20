'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const Model = model.createModel('Model', {
  objectId: UString(),
  url: UString(),
  name: UString(),
  description: UString(),
  type: UString(),
  status: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'models');

module.exports = {
    Model
};