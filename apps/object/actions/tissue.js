'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;

const prehandlers = require('./tissue.pspec');
const parse = require('../../../tool/tsvparse').Tsvparse;
const {
  Individual, Tissue
} = require('../models/index');

const actionCreateTissue = Action.Create({
  name: 'CreateTissue',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionCreateTissue,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
    //   const individualId = req.body.individualId;
       let tissues = parse(path);
       const {tissueDao,individualDao} = ctx.store.default;
       for await (const tissue of tissues) {
         let individual =  await individualDao.findOne({
             IndividualId: tissue.IndividualId,
           });
           
         if (!individual){
           throw  new ctx.errors.IndividualNotFound();
         }
         let one =  await tissueDao.findOne({
             TissueId: tissue.TissueId,
         });
         
       if (one){
         throw  new ctx.errors.TissueExist();
       }
         let p = new Tissue(tissue);
         
         let t = await tissueDao.create(p);
         individual['tissues'].push(t);
         individualDao.updateOne(individual);
     }
       res.json({
         msg: 'success'
       });
  }
});

const actionGetTissues = Action.Create({
  name: 'GetTissues',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetTissues,
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
    const tissueDao = ctx.store.default.tissueDao;
    let tissues = await tissueDao.query({})
    .skip(skip)
    .limit(limit)
    .execute();
    let result = await   Tissue.$extractArray(tissues, {
      includes: {
        IndividualId : true,
        TissueId:true
      }
  });
  const count = await tissueDao.count();
  res.json({
    result: result,
    count: count
  });
  }
});

const actionGetTissue = Action.Create({
  name: 'GetTissue',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetTissue,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const tissueDao = ctx.store.default.tissueDao;
    const tissueId = req.params.tissueId;
    const one = await tissueDao.findOne({
      TissueId: tissueId,
    });
    if (!one){
    throw new ctx.errors.TissueNotFound();
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

const actionUpdateTissue = Action.Create({
  name: 'UpdateTissue',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionUpdateTissue,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
    let tissues = parse(path);
    const tissueDao = ctx.store.default.tissueDao;
    for await (let tissue of tissues) {
        let one =  await tissueDao.findOne({
            TissueId: tissue.TissueId,
          });
          
        if (!one){
          throw  new ctx.errors.TissueNotFound();
        }
        for (const key in tissue){
          one[key]= tissue[key];
        }
        await tissueDao.updateOne(one);
        
    }


    res.json({
      msg: 'success'
    });
  }
});


const actionDeleteTissue = Action.Create({
  name: 'DeleteTissue',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionDeleteTissue,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const tissueDao = ctx.store.default.tissueDao;
    const individualDao = ctx.store.default.individualDao;
    const tissueId = req.params.tissueId;
    const one = await tissueDao.findOne({
      TissueId: tissueId,
    });
    if (!one){
    throw new ctx.errors.TissueNotFound();
    }
    let individual = await individualDao.findOne({
      IndividualId: one.IndividualId
    });
    if (!individual) {
      throw new ctx.errors.IndividualNotFound();
    }
    const index = individual['tissues'].indexOf(one);
    individual['tissues'].splice(index,1);
    await individualDao.updateOne(individual);
    await tissueDao.remove(one);
    res.json({ 
      msg: 'success'
    });
  }
});

module.exports = {
  actionCreateTissue,
  actionGetTissues,
  actionGetTissue,
  actionUpdateTissue,
  actionDeleteTissue
};
