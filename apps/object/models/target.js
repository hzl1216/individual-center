'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;
const UObject = types.UObject;

const Target = model.createModel('Target', {
  DrugName: UString(),
  TargetName: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'targets');

module.exports = {
    Target
};
