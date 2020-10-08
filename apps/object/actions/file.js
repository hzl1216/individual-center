'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const path = require('path');
const prehandlers = require('./file.pspec');
const multiparty = require('multiparty');
const fs = require("fs")

const actionUpload= Action.Create({
  name: 'Upload',
  summary: '',
  description: '上传文件',
  prehandlers: prehandlers.actionUpload,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  
  async handler(req, res, ctx) {
    
    let form = new multiparty.Form();
    form.encoding = 'utf-8';
    let result ={};
    form.uploadDir =path.join( path.dirname(require.main.filename),'upload/'+req.session.User.loginName+'/');
    if (!fs.existsSync(form.uploadDir)){
      fs.mkdirSync(form.uploadDir);
    }
    form.parse(req, function(err, fields, files){
        if (err) throw  err;
        const inputFiles = files.file;
        for (const inputFile of inputFiles ){
          fs.renameSync(inputFile.path, form.uploadDir+inputFile.originalFilename, function (err) {
            if (err) {
                console.log('rename error: ' + err);
            } else {
                console.log('rename ok');
            }
        });
        result['path'] = form.uploadDir+inputFile.originalFilename;
        }

        res.json(result);
    });
  }
});

const actionDownload= Action.Create({
  name: 'Download',
  summary: '',
  description: '下载文件',
  prehandlers: prehandlers.actionDownload,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  
  async handler(req, res,ctx) {
    
    let paths = req.query.path;
    home = path.join( path.dirname(require.main.filename),'upload/'+req.session.User.loginName+'/');
    if(! home in paths) {
      throw new ctx.errors.PrivilegeLimited();
    }
    res.download(paths); 
  }
});

module.exports = {
  actionUpload,
  actionDownload
};
