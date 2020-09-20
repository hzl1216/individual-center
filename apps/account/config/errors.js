'use strict';

module.exports = {
  GuestNotFound: {
    id: 1002,
    message: '访问用户不存在',
    status: 404
  },
  OverTime:{
    id: 10004,
    message: '激活超时',
    status: 403
  },
  CodeError:{
    id: 10005,
    message: '验证码不正确',
    status: 403
  },

  UserNotFound: {
    id: 1001,
    message: '用户不存在',
    status: 404
  },
  PrivilegeNotFound: {
    id: 10002,
    message: '权限不存在',
    status: 404
  },
  PrivilegeExist: {
    id: 10001,
    message: '权限已经存在',
    status: 403
  },
  NameExist: {
    id: 10002,
    message: '用户名已进行注册',
    status: 403
  },
  PasswordError: {
    id: 10003,
    message: '用户密码错误',
    status: 403
  }
};
