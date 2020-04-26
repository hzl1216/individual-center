'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const Sessions = require('../lib/promisifySession');
const prehandlers = require('./user.pspec');
const {
  User,Privilege,Session
} = require('../models/index')
const actionCreateUser = Action.Create({
  name: 'CreateUser',
  summary: '',
  description: '新建user',
  prehandlers: prehandlers.actionCreateUser,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const userDao = ctx.store.default.userDao;
    const one = await userDao.findOne({
        loginName: req.body.loginName,
    });
    if (one){
      throw new ctx.errors.NameExist();
    }
    const user = new User({
      loginName: req.body.loginName,
      password: req.body.password
    });
    await userDao.create(user);
    res.json({
      msg: 'success'
    });
  }
});

const actionGetUsers = Action.Create({
  name: 'GetUsers',
  summary: '',
  description: '批量获取user',
  prehandlers: prehandlers.actionGetUsers,
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
    const userDao = ctx.store.default.userDao;
    let users = await userDao.query({})
    .skip(skip)
    .limit(limit)
    .execute();
    let result = await User.$extractArray(users, {
      includes: {
          id : true,
          loginName: true,
          password: true,
      }
  });
    res.json(
      result
    );
  }
});

const actionGetUser = Action.Create({
  name: 'GetUser',
  summary: '',
  description: '根据loginName获取user',
  prehandlers: prehandlers.actionGetUser,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const userDao = ctx.store.default.userDao;
    const loginName = req.params.loginName;
    const one = await userDao.findOne({
      loginName: loginName,
    });
  if (!one){
    throw new ctx.errors.UserNotFound();
  }
  let result = await one.$extract({
    includes: {
        id : true,
        loginName: true,
        password: true,
    }
  });
    res.json(result);
  }
});

const actionLogin = Action.Create({
  name: 'Login',
  summary: '',
  description: '用户登录',
  prehandlers: prehandlers.actionLogin,
  async handler(req, res, ctx) {
    const userDao = ctx.store.default.userDao;
    const sessionDao = ctx.store.default.sessionDao;

    const one = await userDao.findOne({
      loginName: req.body.loginName,
  });
  if (!one){
    throw new ctx.errors.UserNotFound();
  }
  if (req.body.password != one.password) {
    throw new ctx.errors.PasswordError();
  }
  
  if (one.session) {
    const session = await sessionDao.load(one.session);
    const userSession = new Sessions(req);
    await userSession.destroyStore(session.sessionId);
    await sessionDao.update({
      loginName: one.loginName
    }, {
      $set: {
        sessionId: req.session.id
      }
  });
  }
  else {
    const newsession = new Session({
      loginName: one.loginName,
      sessionId: req.session.id
    });
    let c = await sessionDao.create(newsession);
    one['session']=c;
     await userDao.updateOne(one);
  }
  const user =await one.$extract({
    includes: {
      session : true,
      loginName: true
    }
  });
  req.session.User = user;
  console.log(user);
  res.json({
    userId:  user.id,
    sessionId: req.session.id
  });
    
  }
});
const actionLogout = Action.Create({
  name: 'Logout',
  summary: '',
  description: '退出登录',
  prehandlers: prehandlers.actionLogout,
  async handler(req, res, ctx) {
    const sessionDao = ctx.store.default.sessionDao;
    const userDao = ctx.store.default.userDao;
    if (!req.session.User) {
      throw new ctx.errors.UserNotFound();
    }
    const session = await sessionDao.findOne({
      id: req.session.User.session.id,
    });
    await sessionDao.remove(session);
    await userDao.findOneAndUpdate({
      session: session.id
    },{
      $set: {
        session: null
      }
  });
    delete req.session.User;
    res.json({
    });
  }
});

module.exports = {
  actionCreateUser,
  actionGetUsers,
  actionGetUser,
  actionLogin,
  actionLogout
};
