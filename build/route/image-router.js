'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

var _s = require('../lib/s3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });

var imageRouter = new _express.Router();

imageRouter.post('/images', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'IMAGE ROUTER ERROR: not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new _httpErrors2.default(400, 'IMAGE ROUTER ERROR, invalid request'));
  }

  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;
  // console.log(key, 'this is the key');
  return (0, _s.s3Upload)(file.path, key).then(function (awsUrl) {
    return new _image2.default({
      title: request.body.title,
      account: request.account._id,
      url: awsUrl,
      awskey: key
    }).save();
  }).then(function (image) {
    // console.log(image, 'this is the image in the s3upload being returned');
    response.json(image);
  }).catch(next);
});

imageRouter.get('/images/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _image2.default.findById(request.params.id).then(function (image) {
    if (!image) {
      return next(400, 'No Image, bad ID');
    }

    _logger2.default.log(_logger2.default.INFO, 'Returning a 200 status code and requested Image');
    return response.json(image);
  }).catch(next);
});

imageRouter.delete('/images/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  console.log(request.params.id, 'this is the params id');
  return _image2.default.findById(request.params.id).then(function (image) {
    console.log(image, 'this is the image in the delete route');
    if (!image._id) {
      return next(new _httpErrors2.default(404, 'DELETE - image not found'));
    }
    return (0, _s.s3Remove)(image.awskey);
  }).then(function () {
    return response.sendStatus(204);
  });
});

exports.default = imageRouter;