'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

// Here I have two sets of arguments. 
// 1. callbackStyleFunction => function that we want to promisify
// 2. the set of arguments of the original function
// console.log('hound') => callBackStyleFunction = console.log, args = 'hound'

const promisify = callBackStyleFunction => (...args) => {
  return new Promise((resolve, reject) => {
    callBackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

// ------ Would this work if we know that args is a single element?

// const promisify = ([arg1, arg2], callback) => {
//   return new Promise((resolve, reject) => {
//     callback([arg1, arg2], (error, data) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve(data);
//     });
//   });
// };

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new HttpError(401, 'AUTH - invalid request'));
  }

  return promisify(jsonWebToken.verify)(token, process.env.MY_LAB_SECRET)
    .catch((error) => {
      return Promise.reject(new HttpError(400, 'This was throwing an error', error));
    })
    .then((decryptedToken) => { // same as token seed...token decrypted
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
