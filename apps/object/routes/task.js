'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/task');

const router = new Router({
  name: 'task',
  description: '任务管理'
});

router.post('/', actions.actionCreateTask);
router.post('/update', actions.actionUpdateStatus);
router.get('/', actions.actionGetTasks);

module.exports = {
  router
};
