exports.Client = require('./client').Client;
exports.Container = require('./container').Container;
exports.File  = require('./file').File;

exports.createClient = function (options) {
  return new exports.Client(options);
};