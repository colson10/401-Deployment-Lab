'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3Remove = exports.s3Upload = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// used to remove documents

var s3Upload = function s3Upload(path, key) {
  var aws = require('aws-sdk');
  var amazons3 = new aws.S3();

  var uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: _fsExtra2.default.createReadStream(path)
  };

  return amazons3.upload(uploadOptions).promise() // this comes from aws and calls the interal calllback of the upload method
  .then(function (response) {
    return _fsExtra2.default.remove(path).then(function () {
      return response.Location;
    }) // response.location maps to the upload url link location
    .catch(function (err) {
      return Promise.reject(err);
    });
  }).catch(function (err) {
    return _fsExtra2.default.remove(path).then(function () {
      return Promise.reject(err);
    }).catch(function (fsErr) {
      return Promise.reject(fsErr);
    });
  });
};

var s3Remove = function s3Remove(key) {
  var aws = require('aws-sdk');
  var amazons3 = new aws.S3();

  var removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };

  return amazons3.deleteObject(removeOptions).promise();
};

exports.s3Upload = s3Upload;
exports.s3Remove = s3Remove;