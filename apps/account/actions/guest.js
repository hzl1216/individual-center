'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;
const randomize = require('randomatic');
const Sessions = require('../lib/promisifySession');
const nodemail = require('../lib/nodemailer');
const prehandlers = require('./guest.pspec');
const {
  Guest,Privilege,Session,Information
} = require('../models/index')
const actionCreateGuest = Action.Create({
  name: 'CreateGuest',
  summary: '',
  description: '新建guest',
  prehandlers: prehandlers.actionCreateGuest,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const guestDao = ctx.store.default.guestDao;
    const one = await guestDao.findOne({
        loginName: req.body.loginName,
    });
    if (one){
      throw new ctx.errors.NameExist();
    }
    console.log('ssss');
    const verCode = randomize('0', 6);//这里是我写的生成的随机六位数，等等下面给代码
    var date = new Date();//获取当前时间
    const guest = new Guest({
      loginName: req.body.loginName,
      email: req.body.email,
      code: verCode,
      date: date
    });
    await guestDao.create(guest);
    var mail = {
      // 发件人
      from: '<lizhenlei_ustc@163.com>',
      // 主题
      subject: '接受凭证',//邮箱主题
      // 收件人
      to:req.body.email,//前台传过来的邮箱
      // 邮件内容，HTML格式
      text: '用'+verCode+'作为你的验证码'//发送验证码
     };
    await nodemail(mail);//发送邮件
    res.json({
      msg: 'success'
    });
  }
});


const actionUpdateGuest = Action.Create({
  name: 'UpdateGuest',
  summary: '',
  description: '新建guest',
  prehandlers: prehandlers.actionUpdateGuest,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const guestDao = ctx.store.default.guestDao;
    const one = await guestDao.findOne({
        loginName: req.body.loginName,
    });
    if (!one){
      throw new ctx.errors.GuestNotFound();
    }
    var date = (new Date()).getTime();//获取当前时间
    const code = req.body.code;

    if(one.code === code && date - (one.date.getTime()) < 600000){
      one.email = req.body.email;
      one.password = req.body.password;
      await guestDao.updateOne(one);
      console.log(one);
      res.json({
        msg: 'success'
      });

    }else if(one.code != code){
      throw new ctx.errors.CodeError();
    }else{
      await guestDao.remove(one);
      throw new ctx.errors.OverTime();
    }
  
    
  }
});


const actionUpdateInformation = Action.Create({
  name: 'actionUpdateInformation',
  summary: '',
  description: '更新guest',
  prehandlers: prehandlers.actionUpdateInformation,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const guestDao = ctx.store.default.guestDao;
    const informationDao = ctx.store.default.informationDao;
    
    const guest = await guestDao.findOne({
        loginName: req.body.loginName,
    });
    
    if (!guest){
      throw new ctx.errors.GuestNotFound();
    }
    
    const one = await informationDao.findOne({
      loginName: req.body.loginName,
    });
    
    const info = new Information({
      loginName: req.body.loginName,
      name: req.body.name,
      orgnization: req.body.orgnization,
      title: req.body.title,
      phone: req.body.phone

    });
    
    if(!one){
      let c = await informationDao.create(info);
      console.log('sss')
      console.log(guest['informations'])
      guest['informations'].push(c);
      console.log('dddd')
      await guestDao.updateOne(guest);
    }else{
      await informationDao.updateOne(info);
    }

    res.json({
      msg: 'sucess'
    });  
    
  }
});




const actionGetGuests = Action.Create({
  name: 'GetGuests',
  summary: '',
  description: '批量获取guest',
  prehandlers: prehandlers.actionGetGuests,
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
    const guestDao = ctx.store.default.guestDao;
    let guests = await guestDao.query({})
    .skip(skip)
    .limit(limit)
    .execute();
    let result = await Guest.$extractArray(guests, {
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

const actionGetGuest = Action.Create({
  name: 'GetGuest',
  summary: '',
  description: '根据loginName获取guest',
  prehandlers: prehandlers.actionGetGuest,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res, ctx) {
    const guestDao = ctx.store.default.guestDao;
    const loginName = req.params.loginName;
    const one = await guestDao.findOne({
      loginName: loginName,
    });
  if (!one){
    throw new ctx.errors.GuestNotFound();
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
    const guestDao = ctx.store.default.guestDao;
    const sessionDao = ctx.store.default.sessionDao;

    const one = await guestDao.findOne({
      loginName: req.body.loginName,
  });
  if (!one){
    throw new ctx.errors.GuestNotFound();
  }
  if (req.body.password != one.password) {
    throw new ctx.errors.PasswordError();
  }
  
  if (one.session) {
    const session = await sessionDao.load(one.session);
    const guestSession = new Sessions(req);
    await guestSession.destroyStore(session.sessionId);
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
     await guestDao.updateOne(one);
  }
  const guest =await one.$extract({
    includes: {
      session : true,
      loginName: true
    }
  });
  req.session.Guest = guest;
  console.log(guest);
  res.json({
    guestId:  guest.id,
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
    const guestDao = ctx.store.default.guestDao;
    if (!req.session.Guest) {
      throw new ctx.errors.GuestNotFound();
    }
    const session = await sessionDao.findOne({
      id: req.session.Guest.session.id,
    });
    await sessionDao.remove(session);
    await guestDao.findOneAndUpdate({
      session: session.id
    },{
      $set: {
        session: null
      }
  });
    delete req.session.Guest;
    res.json({
    });
  }
});

module.exports = {
  actionCreateGuest,
  actionUpdateGuest,
  actionUpdateInformation,
  actionGetGuests,
  actionGetGuest,
  actionLogin,
  actionLogout
};
