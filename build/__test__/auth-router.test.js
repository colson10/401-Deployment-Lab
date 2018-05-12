'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _mockAccount = require('./lib/mock-account');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('Auth Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_mockAccount.pRemoveAccountMock);

  describe('POST route /signup', function () {
    test('should return a 200 status code and a TOKEN', function () {
      return _superagent2.default.post(apiUrl + '/signup').send({
        username: 'carl',
        email: 'carl@olson.com',
        password: 'HenryO'
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });
    test('should return a 400 status code when no name is sent', function () {
      return _superagent2.default.post(apiUrl + '/signup').send({}).then(Promise.reject).catch(function (response) {
        expect(response.status).toEqual(400);
      });
    });
    test('should return 409 status code due to duplicate name', function () {
      // eslint-disable-line
      return (0, _mockAccount.pCreateAccountMock)().then(function (mock) {
        var mockAccount = {
          username: mock.request.username,
          email: mock.request.email,
          password: mock.request.password
        };
        return _superagent2.default.post(apiUrl + '/signup').send(mockAccount);
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(409);
      });
    });
  });

  describe('GET /login', function () {
    test('GET /login should return a 200 status code and TOKEN', function () {
      return (0, _mockAccount.pCreateAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiUrl + '/login').auth(mock.request.username, mock.request.password);
      }).then(function (response) {
        // when i login i get a 200 code and a TOKEN
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });
  });
});