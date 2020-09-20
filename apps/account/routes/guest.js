'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/guest');

const router = new Router({
  name: 'guest',
  description: '用户管理'
});

router.post('/', actions.actionCreateGuest);
router.post('/register', actions.actionUpdateGuest);
router.post('/information', actions.actionUpdateInformation);
router.post('/login', actions.actionLogin);
router.post('/logout', actions.actionLogout);
router.get('/', actions.actionGetGuests);
router.get('/:loginName', actions.actionGetGuest);

module.exports = {
  router
};
