'use strict';

const um = require('unique-model');
const model = um.model;
const types = um.type;

const UString = types.UString;
const UObject = types.UObject;
const UDateTime = types.UDateTime;

const Task = model.createModel('Task', {
  username: UString(),
  name: UString(),
  description: UString(),
  model: UObject({
    type: 'Model'
  }),
  rawdata: UObject({
    type: 'RawData'
  }),
  processeddata: UObject({
    type: 'ProcessedData'
  }),
  status: UString(),
  log: UString(),
  stdout: UString(),
  createdAt: UDateTime(),
  updatedAt: UDateTime(),
  finishedAt: UDateTime(),
  inputparams: UString(),
  outparams: UString()
}, 'tasks');

module.exports = {
  Task
};
