var util = require('util'),
    _ = require('lodash'),
    base  = require('../../core/storage/container');

var Container = exports.Container = function Container(client, details) {
  base.Container.call(this, client, details);
};

util.inherits(Container, base.Container);

Container.prototype._setProperties = function (details) {
  if (typeof details === 'string') {
    this.name = details.name;
    return;
  }

  this.name = details.name || details.Name;
  this.region = details.region || details.Location;
  this.creationDate = details.creationDate || details.CreationDate;
  this.StorageClass = details.StorageClass || details.StorageClass;
}

Container.prototype.toJSON = function () {
  return _.pick(this, ['name', 'region', 'creationDate', 'StorageClass']);
};
