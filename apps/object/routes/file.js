'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/file');

const router = new Router({
  name: 'file',
  description: '文件上传下载'
});
router.post('/upload', actions.actionUpload);
router.get('/download', actions.actionDownload)
module.exports = {
  router
};
