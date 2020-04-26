'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/tissue');

const router = new Router({
  name: 'tissue',
  description: '组织管理'
});

router.post('/', actions.actionCreateTissue);
router.get('/', actions.actionGetTissues);
router.get('/:tissueId', actions.actionGetTissue);
router.post('/update', actions.actionUpdateTissue);
router.delete('/:tissueId', actions.actionDeleteTissue);
module.exports = {
  router
};
