'use strict';

const kexpress = require('kexpress');
const path = require('path');
const fs = require("fs");
const marked = require( "marked" );
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
const { stringify } = require('querystring');

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
      const inputparams = req.body.inputparams;
      const outparams =  req.body.outparams;
      const model = await modelDao.findOne({
        name: req.body.modelname
      });
      if (!model) {
        throw new ctx.errors.ModelNotExist();
      }
      const count = await taskDao.count();
      const taskname=model.name+'_'+count;
      const description=model.description; 
      const task = new Task({
          username: req.session.User.loginName,
          name: taskname,
          description: description,
          model: model,  
          status: '未执行',
          inputparams: inputparams,
          outparams: outparams,
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
      const home =path.join( path.dirname(require.main.filename),'upload/'+req.session.User.loginName+'/');
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
                username: true,
                name: true,
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
                inputparams:true,
                outparams:true,
                description: true,
                status: true
            }
            });
            let callback1 = function (err,exeu, log) {

                t['status'] = '执行失败'
                t['stdout'] = exeu+ err;
                t['log'] = log
                t['finishedAt'] = new Date();
                console.log(exeu+ err);
                t['outparams'] =  JSON.stringify(outparams);
                taskDao.updateOne(t);
            }
            let callback2 = function(stdout,exeu, log) {
                t['status'] = '执行成功';
                t['stdout'] = exeu+stdout;
                t['log'] = log
                t['finishedAt'] = new Date();
                console.log(exeu+ stdout);
                t['outparams'] = JSON.stringify(outparams);
                taskDao.updateOne(t);
            }
            let inputparams = task.inputparams;
            let outparams = task.outparams;
          if (!inputparams) {
              inputparams = '[]'
          }
          if (!outparams) {
            outparams = '[]'
        } 
        inputparams=JSON.parse(inputparams);
        outparams=JSON.parse(outparams);
        for(var i=0;i<inputparams.length;i++)
        {
            if (inputparams[i]['type'] == '文件'){
              inputparams[i]['value'] = path.join(home, inputparams[i]['default']);
            }
        }
        for(var i=0;i<outparams.length;i++)
        {
            if (outparams[i]['type'] == '文件'){
              outparams[i]['value'] = path.join(home, outparams[i]['default']);
            }
        }
          const args = {
            inputparams: inputparams,
            outparams: outparams,
            log : path.join(home, task.name+'.log')
          }

          if (task.model.type == 'R'){
              console.log('run R');
              exec_R(task.model.url,args,callback1,callback2);
          }
          if (task.model.type == 'python'){
            console.log('run python');
            exec_python(task.model.url,args,callback1,callback2);
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
                url: true
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
            stdout:true,
            createdAt: true,
            updatedAt: true,
            finishedAt: true,
            inputparams: true,
            outparams: true
        }
    });
      res.json({
        result: result,
      });
    }
  });
  
  const actionGetTask = Action.Create({
    name: 'actionGetTask',
    summary: '',
    description: '获取任务',
    prehandlers: prehandlers.actionGetTask,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const  { taskDao } = ctx.store.default;
      let where = {}
      if (req.query.id) {
          where['id'] = req.query.id;
      }
      if (req.query.name) {
        where['name'] = req.query.name;
    }


      let task = await taskDao.findOne(where);
     
      let result = await  task.$extract({
        includes: {
            name: true,
            description: true,
            model: {
                name: true,
                url: true
            },
            rawdata: {
                url: true,
                type: true
            },
            processeddata:{
                url: true,
                type: true
            },
            log: true,
            status: true,
            stdout:true,
            createdAt: true,
            updatedAt: true,
            finishedAt: true,
            inputparams: true,
            outparams: true
        }
    });
    let str;
    await fs.readFile(task.log, function(err, data){
      if(err){
          console.log(err);
      }else{
           str = marked(data.toString());
          console.log(str);
      } 
  });
      res.json({
        result: result,
        log: str
      });
    }
  });

  module.exports = {
    actionCreateTask,
    actionUpdateStatus,
    actionGetTasks,
    actionGetTask
  };
  