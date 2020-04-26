'use strict';

module.exports = {
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
