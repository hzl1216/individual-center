'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/user');

const router = new Router({
  name: 'user',
  description: '用户管理'
});

router.post('/', actions.actionCreateUser);
router.post('/login', actions.actionLogin);
router.post('/logout', actions.actionLogout);
router.get('/', actions.actionGetUsers);
router.get('/:loginName', actions.actionGetUser);

module.exports = {
  router
};
