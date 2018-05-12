'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'Processing a ' + request.method + ' on ' + request.url);
  return next();
};