'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UObjectArray = types.UObjectArray;
const UDateTime = types.UDateTime;

const Tissue = model.createModel('Tissue', {
  name: UString(),
  description: UString(),
  TissueId: UString(),
  IndividualId: UString(),
  rna: UObjectArray({
    type: 'Rna'
  }),
  wes: UObjectArray({
    type: 'Wes'
  }),
  protein: UObjectArray({
    type: 'Protein'
  }),
  phosphoprotein: UObjectArray({
    type: 'PhosphoProtein'
  }),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'tissues');

module.exports = {
  Tissue
};
