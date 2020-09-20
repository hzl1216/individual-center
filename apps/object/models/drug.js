'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UDateTime = types.UDateTime;
const UObjectArray = types.UObjectArray;
const Uint = types.UInteger; 
const Drug = model.createModel('Drug', {
  targets: UObjectArray({
    type: 'Target'
  }),

  DrugName: UString(),
  ChineseName1: UString(),
  ChineseName2: UString(),
  EnglishgoodsName: UString(),
  ChinesegoodsName1: UString(),
  ChinesegoodsName2: UString(),
  ChinesegoodsName3: UString(),
  status: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime()
}, 'drugs');

module.exports = {
  Drug
};
