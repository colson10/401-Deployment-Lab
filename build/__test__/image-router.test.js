'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

// double check that I'm using IMAGE and file path and info is correct.
// this note is due to following along in class...Judy is making a sound

var mockForDelete = {};

describe('Testing routes at /images', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  // afterEach(pRemoveImageMock);

  describe('POST to /images', function () {
    test('should return 200 for a successful POST', function () {
      // jest.setTimeout(10000);
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        // const token = mockResponse.accountMock.token
        mockForDelete = mockResponse;
        // console.log(mockForDelete, 'this is the mockForDelete object in the post test');
        var token = mockResponse.accountMock.token; // same as above line

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('title', 'image of dog').attach('image', __dirname + '/assets/dog.jpg').then(function (response) {
          mockForDelete.awskey = response.body.awskey;
          // console.log(response.body, 'this is the response in the post rest');
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('image of dog');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        expect(err.status).toEqual(200);
      });
    });

    test('should return a 400 status if incomplete data is sent', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('label', 'image of dog') // label instead of title
        .attach('image', __dirname + '/assets/dog.jpg');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });

    test('should return a 401 status if token is invalid', function () {
      return (0, _imageMock.pCreateImageMock)().then(function () {
        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer').field('title', 'image of dog').attach('image', __dirname + '/assets/dog.jpg');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('GET /images/:id', function () {
    test('GET /images/:id should return a 200 status code and the image with the requested id', function () {
      var accountInstance = void 0;
      return (0, _imageMock.pCreateImageMock)().then(function (mockAccount) {
        accountInstance = mockAccount;
        return _superagent2.default.get(apiUrl + '/images/' + mockAccount.image._id).set('Authorization', 'Bearer ' + mockAccount.accountMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(accountInstance.image.title);
        expect(response.body.url).toEqual(accountInstance.image.url);
      });
    });

    test('GET /images/:id should return a 404 error status code if sent with a bad id', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mockAccount) {
        return _superagent2.default.get(apiUrl + '/images/thisIsAnInvalidId').set('Authorization', 'Bearer ' + mockAccount.accountMock.token);
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });

    test('GET /images/:id should return a 401 error status code if sent with invalid token', function () {
      return (0, _imageMock.pCreateImageMock)().then(function () {
        return _superagent2.default.get(apiUrl + '/images/thisIsAnInvalidId').set('Authorization', 'Bearer');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('DELETE /images/:id', function () {
    test('DELETE /images/:id should return a 204 status code if the image is not there', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mockAccount) {
        return _superagent2.default.delete(apiUrl + '/images/' + mockAccount.image._id).set('Authorization', 'Bearer ' + mockAccount.accountMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(204);
      });
    });
    // test('DELETE /images/:id should return a 204 status code if the image is not there', () => {
    //   console.log(mockForDelete.image._id, 'this is the image id in delete block');
    //   console.log(mockForDelete.accountMock.token, 'this is the token');
    //   return superagent.delete(`${apiUrl}/images/${mockForDelete.image._id}`)
    //     .set('Authorization', `Bearer ${mockForDelete.accountMock.token}`)
    //     .then((response) => {
    //       console.log(response, 'this is the response');
    //       expect(response.status).toEqual(204);
    //     });
    // });

    test('DELETE /images/:id should return a 400 error status code if sent with a bad id', function () {
      return _superagent2.default.delete(apiUrl + '/images/thisIsAnInvalidId').then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });

    test('DELETE /images/:id should return a 401 error status code if sent with invalid token', function () {
      return (0, _imageMock.pCreateImageMock)().then(function () {
        return _superagent2.default.delete(apiUrl + '/images/thisIsAnInvalidId').set('Authorization', 'Bearer');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });
});