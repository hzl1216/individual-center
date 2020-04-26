'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;

const prehandlers = require('./data.pspec');
const {
  PhosphoProtein,Rna,Wes,Protein,Tissue
} = require('../models/index');
const actionCreateData = Action.Create({
  name: 'CreateData',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionCreateData,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const {phosphoProteinDao, tissueDao, proteinDao, rnaDao, wesDao} = ctx.store.default;
    const dataModels = {
      wes: {
        model: Wes,
        dao: wesDao
      },
      rna: {
        model: Rna,
        dao: rnaDao
      },
      protein: {
        model: Protein,
        dao: proteinDao
      },
      phosphoprotein: {
        model: PhosphoProtein,
        dao: phosphoProteinDao
      },
    }
    const type=req.body.type;
    const tissueId = req.body.tissueId;
    
    const model = dataModels[type].model;
    const dao = dataModels[type].dao;
    let tissue = await tissueDao.findOne({
      TissueId: tissueId
    });
    if (!tissue){
      throw new ctx.errors.TissueNotFound();
    };
    const one = await dao.findOne({
      objectId: req.body.id,
    });
    if (one) {
      throw new ctx.errors.DataExist();
    }
    const object = new  model({
      TissueId: tissueId,
      objectId: req.body.id,
      url: req.body.url,
      rawurl: req.body.rawurl
    });
    let c = await dao.create(object);
    tissue[type].push(c);
    await tissueDao.updateOne(tissue);
    res.json({
      msg: 'success'
    });
  }
});

const actionGetDatas = Action.Create({
  name: 'GetDatas',
  summary: '',
  description: '获取组学数据',
  prehandlers: prehandlers.actionGetDatas,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const {phosphoProteinDao, tissueDao, proteinDao, rnaDao, wesDao} = ctx.store.default;
    const dataModels = {
      wes: {
        model: Wes,
        dao: wesDao
      },
      rna: {
        model: Rna,
        dao: rnaDao
      },
      protein: {
        model: Protein,
        dao: proteinDao
      },
      phosphoprotein: {
        model: PhosphoProtein,
        dao: phosphoProteinDao
      },
    }
    const {
      skip,
      limit,
      type
    } = req.query;

    const model = dataModels[type].model;
    const dao = dataModels[type].dao;

    let objects = await dao.query({})
    .skip(skip)
    .limit(limit)
    .execute();

    let result = await   model.$extractArray(objects, {
      includes: {
        objectId : true,
        TissueId: true,
        url: true,
        rawurl: true,
      }
  });
    res.json(
      result
    );
  }
});

const actionGetData = Action.Create({
  name: 'GetData',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetData,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const {phosphoProteinDao, proteinDao, rnaDao, wesDao} = ctx.store.default;
    const dataModels = {
      wes: {
        model: Wes,
        dao: wesDao
      },
      rna: {
        model: Rna,
        dao: rnaDao
      },
      protein: {
        model: Protein,
        dao: proteinDao
      },
      phosphoprotein: {
        model: PhosphoProtein,
        dao: phosphoProteinDao
      },
    }
    
    const {
      type
    } = req.query;
    const id = req.params.id;
    const dao = dataModels[type].dao;

    const one = await dao.findOne({
      objectId: id,
    });
    if (!one){
    throw new ctx.errors.DataNotFound();
    }
    let result = await one.$extract({
      includes: {
        objectId : true,
        TissueId: true,
        url: true,
        rawurl: true,
      }
    });
    res.json(result);    
  }
});

const actionDeleteData = Action.Create({
  name: 'actionDeleteData',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionDeleteData,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const {phosphoProteinDao, proteinDao, rnaDao, wesDao, tissueDao} = ctx.store.default;
    const dataModels = {
      wes: {
        model: Wes,
        dao: wesDao
      },
      rna: {
        model: Rna,
        dao: rnaDao
      },
      protein: {
        model: Protein,
        dao: proteinDao
      },
      phosphoprotein: {
        model: PhosphoProtein,
        dao: phosphoProteinDao
      },
    }
    
    const {
      type, id , tissueId
    } = req.query;
    const dao = dataModels[type].dao;

    const one = await dao.findOne({
      objectId: id,
    });
    if (!one){
    throw new ctx.errors.DataNotFound();
    }
    const tissue = await tissueDao.findOne({
      TissueId: tissueId,
    });
    if (!one){
    throw new ctx.errors.DataNotFound();
    }
    if (!tissue){
      throw new ctx.errors.TissueNotFound();
      }

      const index = tissue[type].indexOf(one);
      tissue[type].splice(index,1);
      await tissueDao.updateOne(tissue);
      await dao.remove(one);
      res.json({ 
        msg: 'success'
      });    
  }
});

module.exports = {
  actionCreateData,
  actionGetDatas,
  actionGetData,
  actionDeleteData
};
