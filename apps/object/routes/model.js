'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/model');

const router = new Router({
  name: 'model',
  description: '模型管理'
});

router.post('/', actions.actionCreateModel);
router.post('/update', actions.actionUpdateModel);
router.get('/', actions.actionGetModels);
router.get('/:id', actions.actionGetModel);
router.delete('/:id', actions.actionDeleteModel);
module.exports = {
  router
};
