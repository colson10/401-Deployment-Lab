'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HASH_ROUNDS = 8;
var TOKEN_SEED_LENGTH = 128;

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

function pVerifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      throw new _httpErrors2.default(400, 'AUTH - invalid request');
    }
    return _this; // returns entire account
  });
}

function pCreateLoginToken() {
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (account) {
    return _jsonwebtoken2.default.sign({ tokenSeed: account.tokenSeed }, process.env.MY_LAB_SECRET);
  }).catch(function () {
    return new _httpErrors2.default('400');
  });
}

accountSchema.methods.pCreateLoginToken = pCreateLoginToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

var Account = _mongoose2.default.model('account', accountSchema);

// Hash variables: Salt, hashing algo(bcrypt), password, rounds 

Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    password = null; // eslint-disable-line
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;