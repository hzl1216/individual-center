'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/drug');

const router = new Router({
  name: 'drug',
  description: '药物管理'
});

router.post('/', actions.actionCreateDrug);
router.get('/', actions.actionGetDrugs);
router.get('/:DrugName', actions.actionGetDrug);
router.post('/update', actions.actionUpdateDrug);
router.delete('/:DrugName', actions.actionDeleteDrug);
module.exports = {
  router
};
