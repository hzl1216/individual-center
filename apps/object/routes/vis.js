var rio = require("rio");
rio.enableDebug(true);//开启调试模式
rio.evaluate({
    command: "rnorm(20)",
    host : "xxx.xxx.xxx.xxx"//服务器IP地址
    });