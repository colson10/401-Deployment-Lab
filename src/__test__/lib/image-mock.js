'use strict';

import faker from 'faker';
import { pCreateAccountMock, pRemoveAccountMock } from './mock-account';
import Image from '../../model/image';
import Account from '../../model/account';


// Double check there are no 'sound' mocks. writing this following along in class.

const pCreateImageMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;

      return new Image({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
        awskey: faker.lorem.words(1),
      }).save();
    })
    .then((image) => {
      resultMock.image = image;
      return resultMock;
    });
};

const pRemoveImageMock = () => Promise.all([Account.remove({}), Image.remove({})]);

export { pCreateImageMock, pRemoveImageMock };
