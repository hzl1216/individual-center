'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const RawData = model.createModel('RawData', {
  objectId: UString(),
  type: UString(),
  url: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'rawdatas');

module.exports = {
    RawData
};