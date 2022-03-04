import { Collection } from 'mongodb';

import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;
const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};
describe('Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test('Should return an add on success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_mail@mail.com');
    expect(account.password).toBe('any_password');
  });

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut();

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    });

    const account = await sut.loadByEmail('any_mail@mail.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_mail@mail.com');
    expect(account.password).toBe('any_password');
  });

  test('Should return null if load by email fails', async () => {
    const sut = makeSut();

    const account = await sut.loadByEmail('any_mail@mail.com');

    expect(account).toBeFalsy();
  });

  test('Should update the account access token on update access token success', async () => {
    const sut = makeSut();

    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    });

    const fakeAccount = res.ops[0];
    expect(fakeAccount.accessToken).toBeFalsy();
    await sut.updateAccessToken(fakeAccount._id, 'any_token');

    const account = await accountCollection.findOne({ _id: fakeAccount._id });

    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('any_token');
  });
});
