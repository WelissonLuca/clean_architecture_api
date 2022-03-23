import { Collection } from 'mongodb';

import { AccountModel } from '../../../../domain/models/account';
import { SurveyModel } from '../../../../domain/models/survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;
const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
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
  });

  return res.ops[0];
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
  });

  return res.ops[0];
};
describe('Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection('surveysResults');
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('save()', () => {
    test('Should save a survey result if is new', async () => {
      const sut = makeSut();

      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: 'any_answer',
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe('any_answer');
    });
  });
});
