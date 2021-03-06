'use strict';

const kexpress = require('kexpress');
const Prehandler = kexpress.core.prehandler.Prehandler;
const logger = kexpress.core.logger.output;
const errors = kexpress.errors.defineLogicalErrors(
  require('../../config/errors')
);

class PermissionChecker extends Prehandler {
  constructor(options) {
    super();

    if (!options) {
      options = {};
    }
    this._options = options;
  }

  get name() {
    return 'permission-checker';
  }

  get version() {
    return this._options.version;
  }

  async serviceHandle() {
    return true;
  }

  async handle(req, res, context, options) {
    if (!options) {
      return true;
    }

    if (
      !Reflect.has(req, 'session') ||
      !Reflect.has(req.session, 'User') ||
      !Reflect.has(req.session.User, 'id')
    ) {
      throw new errors.NoLoginError();
    }

    const userDao = context.store.default.userDao;
    const user = await userDao.findOne({
      id: req.session.User.id
    });

    if (!user) {
      logger.error(
        `${req.session.User.id} request action ${context.action.name} Forbidden`
      );
      throw new errors.PermissionError();
    }

    return true;
  }
}

module.exports = {
  PermissionChecker: PermissionChecker
};
