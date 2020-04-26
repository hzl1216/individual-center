'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const Wes = model.createModel('Wes', {
  objectId: UString(),
  TissueId: UString(),
  url: UString(),
  rawurl: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'wess');

module.exports = {
  Wes
};