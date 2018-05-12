'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveProfileMock = exports.pCreateProfileMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _profile = require('../../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _mockAccount = require('./mock-account');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateProfileMock = function pCreateProfileMock() {
  var resultMock = {};

  return (0, _mockAccount.pCreateAccountMock)().then(function (accountSetMock) {
    resultMock.accountSetMock = accountSetMock;

    return new _profile2.default({
      mantra: _faker2.default.lorem.words(10),
      profileImage: _faker2.default.random.image(),
      lastName: _faker2.default.name.lastName(),
      firstName: _faker2.default.name.firstName(),
      account: accountSetMock.account._id // This line sets up the relationship
    }).save();
  }).then(function (profile) {
    resultMock.profile = profile;
    return resultMock;
  });
};

var pRemoveProfileMock = function pRemoveProfileMock() {
  return Promise.all([_profile2.default.remove({}), (0, _mockAccount.pRemoveAccountMock)()]);
};

exports.pCreateProfileMock = pCreateProfileMock;
exports.pRemoveProfileMock = pRemoveProfileMock;