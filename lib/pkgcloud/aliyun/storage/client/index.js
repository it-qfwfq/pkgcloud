var util = require('util'),
    OSS = require('ali-oss'),
    aliyun = require('../../client'),
    _ = require('lodash');

var Client = exports.Client = function (options) {
  aliyun.Client.call(this, options)

  _.extend(this, require('./containers'));
  _.extend(this, require('./files'));

  this.oss = new OSS(this._ossConfig);
}

util.inherits(Client, aliyun.Client);