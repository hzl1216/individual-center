'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/privilege');

const router = new Router({
  name: 'privilege',
  description: '权限管理'
});

router.post('/', actions.actionCreatePrivilege);
router.get('/', actions.actionGetPrivileges);
router.get('/:pId', actions.actionGetPrivilege);
module.exports = {
  router
};
