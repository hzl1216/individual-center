'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/clinical');

const router = new Router({
  name: 'clinical',
  description: '临床记录管理'
});

router.post('/', actions.actionCreateClinical);
router.get('/', actions.actionGetClinicals);
router.get('/:clinicalId', actions.actionGetClinical);
router.delete('/:clinicalId', actions.actionDeleteClinical);
router.post('/update', actions.actionUpdateClinical);

module.exports = {
  router
};
