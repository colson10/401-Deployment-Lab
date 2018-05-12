'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _bodyParser = require('body-parser');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileRouter = new _express.Router();
var jsonParser = (0, _bodyParser.json)();

profileRouter.post('/profiles', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }

  return new _profile2.default(_extends({}, request.body, {
    account: request.account._id
  })).save().then(function (profile) {
    _logger2.default.log(_logger2.default.INFO, 'Returning a 200 and a new Profile');
    return response.json(profile);
  }).catch(next);
});

profileRouter.get('/profiles/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _profile2.default.findById(request.params.id).then(function (profile) {
    if (!profile) {
      return next(new _httpErrors2.default(400, ' no profile AUTH - invalid request'));
    }
    _logger2.default.log(_logger2.default.INFO, 'Returning a 200 status code and requested Profile');
    return response.json(profile);
  }).catch(next);
});

exports.default = profileRouter;