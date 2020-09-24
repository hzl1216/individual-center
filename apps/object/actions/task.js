'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const {
    exec_python,
    exec_R
} = require('../../../tool/exeu');
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
          status: '未执行',
          createdAt: new Date().getTime()
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

      
      let t = await taskDao.findOne({
        id: id
      });
      if (!t) {
        throw new ctx.errors.TaskNotExist();
      }

      t['status'] = status
      if (status == '执行中'){
        let task = await t.$extract({
            includes: {
                rawdata : {
                    url: true,
                    type: true
                },
                processeddata : {
                    url: true,
                    type: true
                },
                model: {
                type:true,
                url: true
                },
                description: true,
                status: true
            }
            });
          const args = {
            rawurl: task.rawdata.url,
          }
          if (task.model.type == 'R'){
                console.log('run R');
              exec_R(task.model.url,args)
          }
          if (task.model.type == 'python'){
            console.log('run python');
            exec_python(task.model.url,args)
        }
      }

      await taskDao.updateOne(t);
      res.json({
        msg: 'success',
      });
    }
  });

  const actionGetTasks = Action.Create({
    name: 'actionGetTasks',
    summary: '',
    description: '获取任务',
    prehandlers: prehandlers.actionGetTasks,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const  { taskDao } = ctx.store.default;
      let where = {}
      if (req.query.status) {
          where['status'] = req.query.status
      }


      const {
        skip,
        limit
      } = req.query;
      let tasks = await taskDao.query(where)
      .skip(skip)
      .limit(limit)
      .execute();
     
      let result = await   Task.$extractArray(tasks, {
        includes: {
            name: true,
            description: true,
            model: {
                name: true,
            },
            rawdata: {
                url: true,
                type: true
            },
            processeddata:{
                url: true,
                type: true
            },
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    });
      res.json({
        result: result,
      });
    }
  });
  

  module.exports = {
    actionCreateTask,
    actionUpdateStatus,
    actionGetTasks
  };
  