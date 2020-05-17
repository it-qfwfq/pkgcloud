var util  = require('util'),
  base  = require('../../core/storage/file'),
  _ = require('lodash');

var File = exports.File = function File(client, details) {
  base.File.call(this, client, details);
};

util.inherits(File, base.File);

File.prototype._setProperties = function (details) {
  this.name = details.name;
  this.type = details.type;
  this.etag = details.ETag || details.etag || details.res.headers.etag || null;
  this.lastModified = details.LastModified || details.lastModified || null;
  this.size = +(details.size || details['content-length'] || details.ContentLength) || 0;
  this.container = details.container || details.Bucket;
  this.url = details.url;
}

File.prototype.toJSON = function () {
  return _.pick(this, ['name', 'type', 'etag', 'size', 'lastModified', 'container', 'url']);
}
