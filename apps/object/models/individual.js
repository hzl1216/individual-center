'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;
const UObjectArray = types.UObjectArray;
const Uint = types.UInteger; 
const Individual = model.createModel('Individual', {
  clinicals: UObjectArray({
    type: 'Clinical'
  }),
  tissues: UObjectArray({
    type: 'Tissue'
  }),
  IndividualId: UString(),
  Gender: UString(),
  Age: Uint(),
  KRAS: UString(),
  BRAF: UString(),
  PrimaryPurity: UString(),
  AgeGrp: UString(),
  Stage: UString(),
  LM: UString(),
  Metastasis: UString(),
  PreTherapy: UString(),
  CEA: UString(),
  Grade: UString(),
  Histology: UString(),
  MSI: UString(),
  site: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'individuals');

module.exports = {
  Individual
};
