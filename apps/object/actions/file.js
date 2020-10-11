'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const path = require('path');
const prehandlers = require('./file.pspec');
const Multiparty = require('../../../tool/promisifymultiparty');
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
  
  async handler(req, res) {
    const home = path.join( path.dirname(require.main.filename),'upload/'+req.session.User.loginName+'/');
    console.log(home);
    const form = new Multiparty({
      uploadDir: home,
      encoding: 'utf-8'
    });
    let result ={};
    try{
    const content = await form.parse(req);
    for(const file of content.files.file){
      fs.renameSync(file.path, home+file.originalFilename, function (err) {
        if (err) {
            console.log('rename error: ' + err);
        } else {
            console.log('rename ok');
        }
    });
    result['path'] = home+file.originalFilename;
    }
        res.json(result);
  }catch(e){
    res.json({
      error: e
    })
  }
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
    const home = path.join( path.dirname(require.main.filename),'upload/'+req.session.User.loginName+'/');
    if(paths.indexOf(home) == -1) {
      throw new ctx.errors.PrivilegeLimited();
    }
    res.download(paths); 
  }
});

module.exports = {
  actionUpload,
  actionDownload
};
