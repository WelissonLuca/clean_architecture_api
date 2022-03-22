import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;
describe('Survey Routes', () => {
  beforeEach(async () => {
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

  describe('POST / Survey', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            { answer: 'Answer 1', image: 'http://image-name.com' },
            { answer: 'Answer 2' },
          ],
        })
        .expect(403);
    });

    test('should return 204 on add survey with valid token', async () => {
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
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            { answer: 'Answer 1', image: 'http://image-name.com' },
            { answer: 'Answer 2' },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    test('should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403);
    });
  });

  test('should return 200 on load surveys with valid token', async () => {
    await surveyCollection.insertMany([
      {
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
          {
            answer: 'any_answer',
          },
        ],
        date: new Date(),
      },
      {
        question: 'other_question',
        answers: [
          {
            image: 'other_image',
            answer: 'other_answer',
          },
          {
            answer: 'other_answer',
          },
        ],
        date: new Date(),
      },
    ]);

    const res = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'valid@mail.com',
      password: '123456',
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

    await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .send()
      .expect(200);
  });
});
