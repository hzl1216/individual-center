'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;

const prehandlers = require('./privilege.pspec');
const {
  User,Privilege
} = require('../models/index')
const actionCreatePrivilege = Action.Create({
  name: 'CreatePrivilege',
  summary: '',
  description: '新建权限',
  prehandlers: prehandlers.actionCreatePrivilege,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const privilegeDao = ctx.store.default.privilegeDao;
    const one = await privilegeDao.findOne({
      name: req.body.name,
    });
    if (one){
      throw new ctx.errors.PrivilegeExist();
    }
    const p = new Privilege({
      name: req.body.name,
      description: req.body.description
    });
    await privilegeDao.create(p);
    res.json({
      msg: 'success'
    });
  }
});

const actionGetPrivileges = Action.Create({
  name: 'GetPrivileges',
  summary: '',
  description: '分页获取权限',
  prehandlers: prehandlers.actionGetPrivileges,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
 async handler(req, res, ctx) {
  const {
    skip,
    limit
  } = req.query;
  const privilegeDao = ctx.store.default.privilegeDao;
  let privileges = await privilegeDao.query({})
  .skip(skip)
  .limit(limit)
  .execute();
  let result = await User.$extractArray(privileges, {
    includes: {
        id : true,
        name: true,
        description: true,
    }
});
  res.json(
    result
  );
}
});

const actionGetPrivilege = Action.Create({
  name: 'GetPrivilege',
  summary: '',
  description: '根据id获取权限',
  prehandlers: prehandlers.actionGetPrivilege,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
 async handler(req, res, ctx) {

    const privilegeDao = ctx.store.default.privilegeDao;
    const pId = req.params.pId;
      const one = await privilegeDao.findOne({
        id: pId,
      });
    if (!one){
      throw new ctx.errors.PrivilegeNotFound();
    }
    let result = await one.$extract({
      includes: {
          id : true,
          name: true,
          description: true,
      }
    });
      res.json(result);
}
});
module.exports = {
  actionCreatePrivilege,
  actionGetPrivileges,
  actionGetPrivilege
};
