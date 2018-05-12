'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import Account from '../model/account';
import logger from '../lib/logger';
import basicAuthMiddleware from '../lib/basic-auth-middleware';


const authRouter = new Router();
const jsonParser = json();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username) {
    logger.log(logger.INFO, '400 - invalid request');
    return response.sendStatus(400);
  }
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return account.pCreateLoginToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - returning a 200 code and a token');
      return response.json({ token });
    })
    .catch(next);
});

authRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return request.account.pCreateLoginToken()
    .then((token) => {
      logger.log(logger.INFO, 'responding with a 200 status code and a TOKEN');
      return response.json({ token });
    })
    .catch(next);
});

export default authRouter;
