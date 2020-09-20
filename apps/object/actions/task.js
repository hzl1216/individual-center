'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const parse = require('../../../tool/tsvparse').Tsvparse;
const prehandlers = require('./task.pspec');
const {
    Model,
    Task, 
    RawData,
    ProcessedData
} = require('../models/index');
const rawdata = require('../models/rawdata');
const { type } = require('unique-model');

const actionCreateTask = Action.Create({

    name: 'CreateTask',
    summary: '',
    description: '',
    prehandlers: prehandlers.actionCreateTask,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const {taskDao, modelDao, rawDataDao, processedDataDao} = ctx.store.default;
      const rawurl = req.body.rawurl;
      const rawtype = req.body.rawtype;

      const model = await modelDao.findOne({
        id: req.body.modelId
      });
      if (!model) {
        throw new ctx.errors.ModelNotExist();
      }
      const count = await taskDao.count();
      const taskname=model.name+'_'+count;
      const description=model.description; 
      const task = new Task({
          name: taskname,
          description: description,
          model: model,  
          status: '未执行' 
      })
    let rawdata = await rawDataDao.findOne({
        url: rawurl,
        type: rawtype
    })
    if (!rawdata){
        rawdata = new RawData({
            url: rawurl,
            type: model.name
        });
        rawdata = await rawDataDao.create(rawdata)
        task['rawdata'] = rawdata
    }
      
      let t = await taskDao.create(task);
      res.json({
        msg: 'success',
        id: t.id
      });
    }
  });

  const actionUpdateStatus = Action.Create({

    name: 'UpdateStatus',
    summary: '',
    description: '',
    prehandlers: prehandlers.actionUpdateStatus,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const { taskDao } = ctx.store.default;
      const id= req.body.id;
      const status =req.body.status;

      
      let task = await taskDao.findOne({
        id: id
      });
      if (!task) {
        throw new ctx.errors.TaskNotExist();
      }
      task['status'] = status

      await taskDao.updateOne(task);
      res.json({
        msg: 'success',
      });
    }
  });

  module.exports = {
    actionCreateTask,
    actionUpdateStatus
  };
  