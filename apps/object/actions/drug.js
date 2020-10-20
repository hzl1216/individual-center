'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const parse = require('../../../tool/excelparse').Excelparse;
const prehandlers = require('./drug.pspec');
const {
  Drug, Target
} = require('../models/index');
const actionCreateDrug = Action.Create({
  name: 'CreateDrug',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionCreateDrug,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    
    const path = req.body.path;
    let drugs = parse(path);
    
    const drugDao = ctx.store.default.drugDao;
    const targetDao = ctx.store.default.targetDao;

    for await (const drug of drugs) {
        let one =  await drugDao.findOne({
            DrugName: drug['英文通用名'],
          });
        var map = new Map();
        map.set('英文通用名','DrugName')
        map.set('中文通用名1','ChineseName1')
        map.set('中文通用名2','ChineseName2')
        map.set('英文商品名','EnglishgoodsName')
        map.set('中文商品名1','ChinesegoodsName1')
        map.set('中文商品名2','ChinesegoodsName2')
        map.set('中文商品名3','ChinesegoodsName3')
        map.set('状态','status')
        if (!one){
          let p = new Drug({
            DrugName: drug['英文通用名'],
            status: drug['状态'],
          });

          for (const key in drug){
            p[map.get(key)]= drug[key];   
          }
          console.log(p);
          
          await drugDao.create(p);
          one = await drugDao.findOne({
            DrugName: drug['英文通用名'],
          });
        }
        
        let targ =  await targetDao.findOne({
          DrugName: drug['英文通用名'],
          TargetName: drug['Targets'],
        });
        
        
        if(!targ){
          let targe = new Target({
            DrugName: drug['英文通用名'],
            TargetName: drug['Targets'],
          });
           
          let c = await targetDao.create(targe);
          
          one['targets'].push(c);
          await drugDao.updateOne(one);
          
        }
         
        
      }


    res.json({
      msg: 'success'
    });
  }
});

const actionGetDrugs = Action.Create({
  name: 'GetDrugs',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetDrugs,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const {
      skip,
      limit
    } = req.query;
    const drugDao = ctx.store.default.drugDao;
    let drugs = await drugDao.query({})
    .skip(skip)
    .limit(limit)
    .execute();
    let result = await   Drug.$extractArray(drugs, {
      includes: {
        DrugName : true,
        EnglishgoodsName: true,
        status: true,
        targets: {
          TargetName: true
        }
      }
  });
  const count = await drugDao.count();
  res.json({
    result: result,
    count: count
  });
  }
});

const actionGetDrug = Action.Create({
  name: 'GetDrug',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetDrug,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const drugDao = ctx.store.default.drugDao;
    const DrugName = req.params.DrugName;
    const one = await drugDao.findOne({
      DrugName: DrugName,
    });
    if (!one){
    throw new ctx.errors.DrugNotFound();
    }
    let result = await one.$extract({
      includes: {
        DrugName : true,
        EnglishgoodsName: true,
        status: true,
        targets: {
          TargetName: true
        }
      }
    });
    res.json(result);
  }
});

const actionUpdateDrug = Action.Create({
  name: 'UpdateDrug',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionUpdateDrug,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
    let drugs = parse(path);
    const drugDao = ctx.store.default.drugDao;
    for await (let drug of drugs) {
        let one =  await drugDao.findOne({
            DrugName: drug['英文通用名'],
          });
        
        if (!one){
          throw  new ctx.errors.DrugNotFound();
        }
        for (const key in drug){
          one[key]= drug[key];
        }
        await drugDao.updateOne(one);
        
    }


    res.json({
      msg: 'success'
    });
  }
});

const actionDeleteDrug = Action.Create({
  name: 'GetDrug',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionDeleteDrug,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const drugDao = ctx.store.default.drugDao;
    const targetDao = ctx.store.default.targetDao;
    const DrugName = req.params.DrugName;
    const one = await drugDao.findOne({
      DrugName: DrugName,
    });
    if (!one){
    throw new ctx.errors.DrugNotFound();
    }
    const targets = await targetDao.load(one.targets);
    for await(const target of targets ) {
      await targetDao.remove(target);
    }
    
    await drugDao.remove(one);
    
    res.json({
      msg: 'success'
    });
  }
});

module.exports = {
  actionCreateDrug,
  actionGetDrugs,
  actionGetDrug,
  actionUpdateDrug,
  actionDeleteDrug,
};
