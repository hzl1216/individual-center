'use strict';

const bodyParser = require('body-parser');
const kexpress = require('kexpress');
const router = require('./routes').router;
const RequestChecker = require('kexpress-http').RequestChecker;
const ResponseChecker = require('kexpress-http').ResponseChecker;
const FieldsCheckerErrorHandler = require('../../common/prehandlers/fields').errorHandler;
const PermissionChecker = require('../../common/prehandlers/permissionChecker')
.PermissionChecker;
const StoreManager = require('kexpress-store').StoreManager;
const UniqueModelStore = require('kexpress-store-um').UniqueModelStore;
const MongoSession = require('unique-model-mongodb').Session;

class Application extends kexpress.core.app.Application {
  // Override
  async prepare() {
    await super.prepare();

    this.use(kexpress.middlewares.access.createWatcher(this.loggers.access));
    this.use(kexpress.middlewares.httpSession.createHttpSession(this.config.session));
    console.log(__dirname)
    this.use(kexpress.static(__dirname + 'upload'));
    this.use(bodyParser.json({limit: '5000mb'}));
    this.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));
    this.prehandle('request', new RequestChecker(FieldsCheckerErrorHandler, {
      schema: 'kexpress'
    }));
    this.prehandle('response', new ResponseChecker());
    this.prehandle('store', new StoreManager({
      stores: {
        default: new UniqueModelStore({
          backend: MongoSession,
          uri: this._config.store.default.uri
        })
      }
    }));
    this.prehandle('permission', new PermissionChecker());
  }

  // Override
  async createRouters() {
    this.use('/', router);
  }
}

module.exports = {
  Application: Application
};
