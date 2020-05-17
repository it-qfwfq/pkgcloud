var util = require('util'),
    OSS = require('ali-oss'),
    base = require('../core/base');

var Client = exports.Client = function (options) {
  base.Client.call(this, options);

  options = options || {};

  // Allow overriding serversUrl in child classes
  this.provider   = 'aliyun';
  this.protocol   = options.protocol || 'https://';

  this._ossConfig = {
    region: this.config.region || options.region,
    accessKeyId: this.config.accessKeyId || options.accessKeyId,
    accessKeySecret: this.config.accessKeySecret || options.accessKeySecret,
    bucket: this.config.bucket || options.bucket
  }

  if (options.serversUrl) {
    this._ossConfig.httpOptions = {
      proxy: this.protocol + options.serversUrl
    };
  }

  if (!this.before) {
    this.before = [];
  }
}

util.inherits(Client, base.Client);

Client.prototype._toArray = function toArray(obj) {
  if (typeof obj === 'undefined') {
    return [];
  }

  return Array.isArray(obj) ? obj : [obj];
};

Client.prototype.failCodes = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Item not found',
  409: 'Already exists or in progress',
  412: 'Lease error',
  413: 'Request Entity Too Large',
  415: 'Bad Media Type',
  500: 'Fault',
  503: 'Service Unavailable'
};

Client.prototype.successCodes = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-authoritative information',
  204: 'No content'
};
