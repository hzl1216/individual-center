'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;
const UObject = types.UObject;

const Clinical = model.createModel('Clinical', {
  ClinicalId: UString(),
  IndividualId: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'clinicals');

module.exports = {
    Clinical
};
