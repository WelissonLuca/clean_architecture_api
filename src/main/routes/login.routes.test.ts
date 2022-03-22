import { hash } from 'bcrypt';
import { Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper';

import app from '../config/app';

let accountCollection: Collection;
describe('Login Routes', () => {
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

  describe('POST / Signup', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup/')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          passwordConfirmation: '123456',
        })
        .expect(200);
    });
  });

  describe('POST / Login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('123456', 12);
      await accountCollection.insertOne({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password,
      });

      await request(app)
        .post('/api/login/')
        .send({
          email: 'johndoe@email.com',
          password: '123456',
        })
        .expect(200);
    });

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login/')
        .send({
          email: 'johndoe@email.com',
          password: '1234567',
        })
        .expect(401);
    });
  });
});
