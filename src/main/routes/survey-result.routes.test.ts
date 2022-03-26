import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper';

import app from '../config/app';
import env from '../config/env';

let accountCollection: Collection;
let surveyCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'valid@mail.com',
    password: '123456',
    role: 'admin',
  });

  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    { _id: id },
    {
      $set: {
        accessToken,
      },
    }
  );

  return accessToken;
};
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('PUT / surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'Answer 2' })
        .expect(403);
    });

    test('should return 200 save survey wiuth accessToken', async () => {
      const accessToken = await makeAccessToken();
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          { answer: 'Answer 1', image: 'http://image-name.com' },
          { answer: 'Answer 2' },
        ],
        date: new Date(),
      });
      await request(app)
        .put(`/api/surveys/${res.ops[0]._id}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'Answer 2' })
        .expect(200);
    });
  });
});
