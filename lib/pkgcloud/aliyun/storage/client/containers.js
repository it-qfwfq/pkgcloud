var async = require('async'),
  pkgcloud = require('../../../../../lib/pkgcloud'),
  storage = pkgcloud.providers.aliyun.storage;

/**
 * get containers
 */
exports.getContainers = function (callback) {
  var self = this;
  
  self.oss.listBuckets().then((result) => {
    var containers = result.buckets;

    containers = containers.map(function(container) {
      return new (storage.Container)(self, container);
    });

    callback(null, containers);
  }).catch((err) => {
    callback(err);
  });
}

/**
 * get container
 */
exports.getContainer = function (container, callback) {
  var containerName = container instanceof storage.Container ? container.name : container,
    self = this;

  self.oss.getBucketInfo(containerName).then((result) => {
    var container = result.bucket;
    callback(null, new (storage.Container)(self, container));
  }).catch((err) => {
    callback(err);
  });
}

/**
 * create container
 */
exports.createContainer = function (options, callback) {
  var containerName = options instanceof storage.Container ? options.name : options,
    self = this;

  self.oss.putBucket(containerName).then((result) => {
    callback(null, new (storage.Container)(self, result));
  }).catch((err) => {
    callback(err);
  });
}

/**
 * destroy container
 */
exports.destroyContainer = function (container, callback) {
  var containerName = container instanceof storage.Container ? container.name : container,
    self = this;

  // TODO: container should be empty
  self.oss.deleteBucket(containerName).then((result) => {
    callback(null, true);
  }).catch((err) => {
    callback(err);
  });
}