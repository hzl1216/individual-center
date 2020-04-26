'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const parse = require('../../../tool/tsvparse').Tsvparse;
const prehandlers = require('./clinical.pspec');
const {
  Clinical, Individual
} = require('../models/index')
const actionCreateClinical = Action.Create({
  name: 'CreateClinical',
  summary: '',
  description: '新建临床记录',
  prehandlers: prehandlers.actionCreateClinical,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
 //   const individualId = req.body.individualId;
    let clinicals = parse(path);
    const clinicalDao = ctx.store.default.clinicalDao;
    const individualDao = ctx.store.default.individualDao;
    for await (const clinical of clinicals) {
      let individual =  await individualDao.findOne({
          IndividualId: clinical.IndividualId,
        });
        
      if (!individual){
        throw  new ctx.errors.IndividualNotFound();
      }
      let one =  await clinicalDao.findOne({
          ClinicalId: clinical.ClinicalId,
      });
      
    if (one){
      throw  new ctx.errors.ClinicalExist();
    }
      let p = new Clinical(clinical);
      
      let c = await clinicalDao.create(p);
      individual['clinicals'].push(c);
      await individualDao.updateOne(individual);
  }
    res.json({
      msg: 'success'
    });
  }
});

const actionGetClinicals = Action.Create({
  name: 'GetClinicals',
  summary: '',
  description: '获取临床记录',
  prehandlers: prehandlers.actionGetClinicals,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const clinicalDao = ctx.store.default.clinicalDao;
    const {
      skip,
      limit
    } = req.query;
    let clinicals = await clinicalDao.query({})
    .skip(skip)
    .limit(limit)
    .execute();
   
    let result = await   Clinical.$extractArray(clinicals, {
      includes: {
        IndividualId : true,
        ClinicalId: true,
      }
  });
  const count = await clinicalDao.count();
    res.json({
      result: result,
      count: count
    });
  }
});

const actionGetClinical = Action.Create({
  name: 'GetClinical',
  summary: '',
  description: '根据id获取临床记录',
  prehandlers: prehandlers.actionGetClinical,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const clinicalDao = ctx.store.default.clinicalDao;
    const clinicalId = req.params.clinicalId;
    const one = await clinicalDao.findOne({
      ClinicalId: clinicalId,
    });
    if (!one){
    throw new ctx.errors.ClinicalNotFound();
    }
    let result = await one.$extract({
      includes: {
        IndividualId : true,
        ClinicalId: true
      }
    });
    res.json(result);
  }
});

const actionUpdateClinical = Action.Create({
  name: 'UpdateClinical',
  summary: '',
  description: '更新临床记录',
  prehandlers: prehandlers.actionUpdateClinical,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
    let clinicals = parse(path);
    const clinicalDao = ctx.store.default.clinicalDao;
    for await (let clinical of clinicals) {
        let one =  await clinicalDao.findOne({
            ClinicalId: clinical.ClinicalId,
          });
          
        if (!one){
          throw  new ctx.errors.ClinicalNotFound();
        }
        for (const key in clinical){
          one[key]= clinical[key];
        }
        await clinicalDao.updateOne(one);
        
    }


    res.json({
      msg: 'success'
    });
  }
});

const actionDeleteClinical = Action.Create({
  name: 'DeleteClinical',
  summary: '',
  description: '删除临床记录',
  prehandlers: prehandlers.actionDeleteClinical,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const clinicalDao = ctx.store.default.clinicalDao;
    const individualDao = ctx.store.default.individualDao;
    const clinicalId = req.params.clinicalId;
    const one = await clinicalDao.findOne({
      ClinicalId: clinicalId,
    });
    if (!one){
    throw new ctx.errors.ClinicalNotFound();
    }
    let individual = await individualDao.findOne({
      IndividualId: one.IndividualId
    });
    if(!individual){
      throw new ctx.errors.IndividualNotFound();
    }
    const index = individual['clinicals'].indexOf(one);
    individual['clinicals'].splice(index,1);
    await individualDao.updateOne(individual);
    await clinicalDao.remove(one);
    res.json({ 
      msg: 'success'
    });
  }
});

module.exports = {
  actionCreateClinical,
  actionGetClinicals,
  actionGetClinical,
  actionUpdateClinical,
  actionDeleteClinical
};
