'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/individual');

const router = new Router({
  name: 'individual',
  description: '个体管理'
});

router.post('/', actions.actionCreateIndividual);
router.get('/', actions.actionGetIndividuals);
router.get('/:individualId', actions.actionGetIndividual);
router.post('/update', actions.actionUpdateIndividual);
router.delete('/:individualId', actions.actionDeleteIndividual);
module.exports = {
  router
};
