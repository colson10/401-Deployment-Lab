'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { pCreateAccountMock, pRemoveAccountMock } from './mock-account';

const pCreateProfileMock = () => {
  const resultMock = {};

  return pCreateAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;

      return new Profile({
        mantra: faker.lorem.words(10),
        profileImage: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        account: accountSetMock.account._id, // This line sets up the relationship
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const pRemoveProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    pRemoveAccountMock(),
  ]);
};

export { pCreateProfileMock, pRemoveProfileMock };
