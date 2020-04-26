'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/data');

const router = new Router({
  name: 'data',
  description: '组学数据管理'
});

router.post('/', actions.actionCreateData);
router.get('/', actions.actionGetDatas);
router.get('/:id', actions.actionGetData);
router.delete('/', actions.actionDeleteData);

module.exports = {
  router
};
