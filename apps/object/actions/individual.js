'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const parse = require('../../../tool/tsvparse').Tsvparse;
const prehandlers = require('./individual.pspec');
const {
  Individual
} = require('../models/index');
const actionCreateIndividual = Action.Create({
  name: 'CreateIndividual',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionCreateIndividual,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
    let individuals = parse(path);
    const individualDao = ctx.store.default.individualDao;
    for await (const individual of individuals) {
        let one =  await individualDao.findOne({
            IndividualId: individual.IndividualId,
          });
          
        if (one){
          throw  new ctx.errors.IndividualExist();
        }
        individual['Age']= Number(individual['Age']);
        let p = new Individual(individual);
        
        await individualDao.create(p);
        
    }


    res.json({
      msg: 'success'
    });
  }
});

const actionGetIndividuals = Action.Create({
  name: 'GetIndividuals',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetIndividuals,
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
    const individualDao = ctx.store.default.individualDao;
    let individuals = await individualDao.query({})
    .skip(skip)
    .limit(limit)
    .execute();
    let result = await   Individual.$extractArray(individuals, {
      includes: {
        IndividualId : true,
        Gender: true,
        Age: true,
      }
  });
  const count = await individualDao.count();
  res.json({
    result: result,
    count: count
  });
  }
});

const actionGetIndividual = Action.Create({
  name: 'GetIndividual',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetIndividual,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const individualDao = ctx.store.default.individualDao;
    const individualId = req.params.individualId;
    const one = await individualDao.findOne({
      IndividualId: individualId,
    });
    if (!one){
    throw new ctx.errors.IndividualNotFound();
    }
    let result = await one.$extract({
      includes: {
        IndividualId : true,
        Gender: true,
        Age: true,
        clinicals: {
          ClinicalId: true
        }
      }
    });
    res.json(result);
  }
});

const actionUpdateIndividual = Action.Create({
  name: 'UpdateIndividual',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionUpdateIndividual,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const path = req.body.path;
    let individuals = parse(path);
    const individualDao = ctx.store.default.individualDao;
    for await (let individual of individuals) {
        let one =  await individualDao.findOne({
            IndividualId: individual.IndividualId,
          });
          
        if (!one){
          throw  new ctx.errors.IndividualNotFound();
        }
        for (const key in individual){
          one[key]= individual[key];
        }
        await individualDao.updateOne(one);
        
    }


    res.json({
      msg: 'success'
    });
  }
});

const actionDeleteIndividual = Action.Create({
  name: 'GetIndividual',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionDeleteIndividual,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const individualDao = ctx.store.default.individualDao;
    const clinicalDao = ctx.store.default.clinicalDao;
    const tissueDao = ctx.store.default.tissueDao;
    const individualId = req.params.individualId;
    const one = await individualDao.findOne({
      IndividualId: individualId,
    });
    if (!one){
    throw new ctx.errors.IndividualNotFound();
    }
    const clinicals = await clinicalDao.load(one.clinicals);
    for await(const clinical of clinicals ) {
      await clinicalDao.remove(clinical);
    }
    const tissues = await tissueDao.load(one.tissues);
    for await(const tissue of tissues ) {
      await tissueDao.remove(tissue);
    }
    await individualDao.remove(one);
    
    res.json({
      msg: 'success'
    });
  }
});

module.exports = {
  actionCreateIndividual,
  actionGetIndividuals,
  actionGetIndividual,
  actionUpdateIndividual,
  actionDeleteIndividual,
};
