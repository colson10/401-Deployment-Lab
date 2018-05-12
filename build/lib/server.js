'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _authRouter = require('../route/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _profileRoute = require('../route/profile-route');

var _profileRoute2 = _interopRequireDefault(_profileRoute);

var _imageRouter = require('../route/image-router');

var _imageRouter2 = _interopRequireDefault(_imageRouter);

var _loggerMiddleware = require('./logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = null;

app.use(_loggerMiddleware2.default); // logger middleware at the app-level

app.use(_authRouter2.default);
app.use(_profileRoute2.default);
app.use(_imageRouter2.default);

app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'Returning a 404 from the catch/all default route');
  return response.sendStatus(404);
});

app.use(_errorMiddleware2.default); // error catching middleware...this is 'next'

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'SERVER IS LISTENING ON PORT ' + process.env.PORT);
    });
  }).catch(function (err) {
    _logger2.default.log(_logger2.default.ERROR, 'SERVER START ERROR ' + JSON.stringify(err));
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'SERVER IS OFF');
    });
  }).catch(function (err) {
    _logger2.default.log(_logger2.default.ERROR, 'STOP SERVER ERROR, ' + JSON.stringify(err));
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;