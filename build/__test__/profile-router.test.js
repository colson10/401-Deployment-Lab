'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _mockAccount = require('./lib/mock-account');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('POST /profiles', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.pRemoveProfileMock);

  test('POST /profiles should return a 200 status code if successful and the newly created profile', function () {
    var accountMock = null;
    return (0, _mockAccount.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        mantra: 'I like coffee',
        firstName: 'Carl',
        lastName: 'Olson'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.firstName).toEqual('Carl');
      expect(response.body.lastName).toEqual('Olson');
      expect(response.body.mantra).toEqual('I like coffee');
    });
  });

  test('POST /profiles should return a 400 status code if incomplete request data sent', function () {
    return (0, _mockAccount.pCreateAccountMock)().then(function (accountSetMock) {
      return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        mantra: 'I like coffee'
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  test('POST /profiles should return a 401 status code if token is invalid', function () {
    return (0, _mockAccount.pCreateAccountMock)().then(function () {
      return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer').send({
        mantra: 'I like coffee'
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(401);
    });
  });

  describe('GET /profiles/:id', function () {
    test('GET /profiles/:id should return a 200 status code and the profile with the requested id', function () {
      return (0, _profileMock.pCreateProfileMock)().then(function (mockprofile) {
        return _superagent2.default.get(apiUrl + '/profiles/' + mockprofile.profile._id).set('Authorization', 'Bearer ' + mockprofile.accountSetMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(200);
      });
    });

    test('GET /profiles/:id should return 400 status when invalid id is sent', function () {
      return (0, _mockAccount.pCreateAccountMock)().then(function (accountSetMock) {
        return _superagent2.default.get(apiUrl + '/profiles/thisIsAnInvalidId').set('Authorization', 'Bearer ' + accountSetMock.token);
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });

    test('GET /profiles/:id should return 401 status if token is invalid', function () {
      return (0, _mockAccount.pCreateAccountMock)().then(function () {
        return _superagent2.default.get(apiUrl + '/profiles/thisIsAnInvalidId').set('Authorization', 'Bearer');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });
});