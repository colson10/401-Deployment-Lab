'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import Image from '../model/image';
import { s3Upload, s3Remove } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const imageRouter = new Router();

imageRouter.post('/images', bearerAuthMiddleware, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'IMAGE ROUTER ERROR: not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new HttpError(400, 'IMAGE ROUTER ERROR, invalid request'));
  } 

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  // console.log(key, 'this is the key');
  return s3Upload(file.path, key)
    .then((awsUrl) => {
      return new Image({
        title: request.body.title,
        account: request.account._id,
        url: awsUrl,
        // awskey: key,
      }).save();
    })
    .then((image) => {
      // console.log(image, 'this is the image in the s3upload being returned');
      response.json(image);
    })
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  return Image.findById(request.params.id)
    .then((image) => {
      if (!image) {
        return next(400, 'No Image, bad ID');
      }

      logger.log(logger.INFO, 'Returning a 200 status code and requested Image');
      return response.json(image);
    })
    .catch(next);
});

imageRouter.delete('/images/:id', bearerAuthMiddleware, (request, response, next) => { 
  console.log(request.params.id, 'this is the params id');
  return Image.findById(request.params.id)
    .then((image) => {
      console.log(image, 'this is the image in the delete route');
      if (!image._id) {
        return next(new HttpError(404, 'DELETE - image not found'));
      }
      return s3Remove(image.url); // image.awskey?
    })
    .then(() => response.sendStatus(204));
});

export default imageRouter;
