'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const userRouter = require('./user').router;
const privilegeRouter = require('./privilege').router;

const router = new Router({
  name: 'account',
  description: ''
});
router.use('/user', userRouter);
router.use('/privilege', privilegeRouter);

module.exports = {
  router: router
};
