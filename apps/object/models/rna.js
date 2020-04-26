'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const Rna = model.createModel('Rna', {
  objectId: UString(),
  url: UString(),
  rawurl: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'rnas');

module.exports = {
  Rna
};
