var base = require('../../../core/storage'),
    pkgcloud = require('../../../../../lib/pkgcloud'),
    through = require('through2'),
    storage = pkgcloud.providers.aliyun.storage,
    _ = require('lodash');

/**
 * 
 */
exports.removeFile = function (container, file, callback) {
  var self = this;

  if (container instanceof storage.Container) {
    container = container.name;
  }

  if (file instanceof storage.File) {
    file = file.name;
  }

  self.oss.useBucket(container);
  self.oss.delete(file).then((result) => {
    callback(null, result.res.status === 204)
  }).catch((err) => {
    callback(err)
  });
}

/**
 * 
 */
exports.upload = function (options) {
  var self = this;

  // check for deprecated calling with a callback
  if (typeof arguments[arguments.length - 1] === 'function') {
    self.emit('log::warn', 'storage.upload no longer supports calling with a callback');
  }

  var containerName = options.container instanceof base.Container ?
      options.container.name : options.container;
  var file = options.remote instanceof base.File ?
      options.remote.name : options.remote;

  var writableStream = through();
  var proxyStream = through();

  self.oss.useBucket(containerName);
  self.oss.putStream(file, writableStream).then((result) => {
    proxyStream.emit('success', new storage.File(self, result));
  }).catch((err) => {
    proxyStream.emit('error', err);
  });

  proxyStream.pipe(writableStream);
  return proxyStream;
}

/**
 * 
 */
exports.download = function (options) {
  var self = this,
    rstream = through();

  var container = options.container instanceof base.Container ?
      options.container.name : options.container;

  var file = options.remote instanceof base.File ?
      options.remote.name : options.remote;

  self.oss.useBucket(container);
  self.oss.get(file, rstream);

  return rstream;
}

/**
 * 
 */
exports.getFile = function (container, file, callback) {
  var containerName = container instanceof base.Container ? container.name : container,
      self = this;

  self.oss.useBucket(containerName);
  self.oss.head(file).then((result) => {
    callback(null, new storage.File(self, _.extend(result, {
      container: container,
      name: file
    })));
  }).catch((err) => {
    callback(err);
  });
}

/**
 * 
 */
exports.getFiles = function (container, options, callback) {
  var containerName = container instanceof base.Container ? container.name : container,
    self = this;

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  else if (!options) {
    options = {};
  }

  var ossOptions = {};

  if (options.marker) {
    ossOptions.Marker = options.marker;
  }

  if (options.prefix) {
    ossOptions.prefix = options.prefix;
  }

  if (options.maxKeys) {
    ossOptions.MaxKeys = options.maxKeys;
  }

  self.oss.useBucket(containerName);
  self.oss.list(ossOptions).then((result) => {
    callback(null, self._toArray(result.objects).map(function (file) {
      file.container = container;
      return new storage.File(self, file);
    }), {
      isTruncated: result.IsTruncated,
      nextMarker: result.NextMarker
    });
  }).catch((err) => {
    callback(err);
  });
}
