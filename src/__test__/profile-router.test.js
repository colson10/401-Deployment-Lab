'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/mock-account';
import { pRemoveProfileMock, pCreateProfileMock } from './lib/profile-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should return a 200 status code if successful and the newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            mantra: 'I like coffee',
            firstName: 'Carl',
            lastName: 'Olson',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Carl');
        expect(response.body.lastName).toEqual('Olson');
        expect(response.body.mantra).toEqual('I like coffee');
      });
  });

  test('POST /profiles should return a 400 status code if incomplete request data sent', () => {
    return pCreateAccountMock()
      .then((accountSetMock) => {
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            mantra: 'I like coffee',
          });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST /profiles should return a 401 status code if token is invalid', () => {
    return pCreateAccountMock()
      .then(() => {
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', 'Bearer')
          .send({
            mantra: 'I like coffee',
          });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(401);
      });
  });

  describe('GET /profiles/:id', () => {
    test('GET /profiles/:id should return a 200 status code and the profile with the requested id', () => {
      return pCreateProfileMock()
        .then((mockprofile) => {
          return superagent.get(`${apiUrl}/profiles/${mockprofile.profile._id}`)
            .set('Authorization', `Bearer ${mockprofile.accountSetMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });

    test('GET /profiles/:id should return 400 status when invalid id is sent', () => {
      return pCreateAccountMock()
        .then((accountSetMock) => {
          return superagent.get(`${apiUrl}/profiles/thisIsAnInvalidId`)
            .set('Authorization', `Bearer ${accountSetMock.token}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });

    test('GET /profiles/:id should return 401 status if token is invalid', () => {
      return pCreateAccountMock()
        .then(() => {
          return superagent.get(`${apiUrl}/profiles/thisIsAnInvalidId`)
            .set('Authorization', 'Bearer');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
  });
});
