'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const ProcessedData = model.createModel('ProcessedData', {
  objectId: UString(),
  type: UString(),
  url: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'processeddatas');

module.exports = {
    ProcessedData
};