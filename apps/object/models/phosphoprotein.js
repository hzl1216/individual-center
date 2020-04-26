'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;

const PhosphoProtein = model.createModel('PhosphoProtein', {
  objectId: UString(),
  url: UString(),
  rawurl: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'phosphoproteins');

module.exports = {
    PhosphoProtein
};