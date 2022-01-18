import request from 'supertest';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test('should return an account on success', async () => {
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
