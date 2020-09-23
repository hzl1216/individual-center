'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const clinicalRouter = require('./clinical').router;
const dataRouter = require('./data').router;
const tissueRouter = require('./tissue').router;
const individualRouter = require('./individual').router;
const taskRouter = require('./task').router;
const fileRouter = require('./file').router;
const modelRouter = require('./model').router;
const vis = require('./vis')
const router = new Router({
  name: 'object',
  description: ''
});
router.use('/file', fileRouter);
router.use('/clinical', clinicalRouter);
router.use('/data', dataRouter);
router.use('/tissue', tissueRouter);
router.use('/individual', individualRouter);
router.use('/task', taskRouter);
router.use('/model', modelRouter);
router.get('/vis/rio',vis.rio);
module.exports = {
  router: router
};
