import { Collection } from 'mongodb';

import { mockSurveyData, mockSurveys } from '@domain/test';

import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

let surveyCollection: Collection;
const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};
describe('Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();

      await sut.add(mockSurveyData());

      const survey = await surveyCollection.findOne({
        question: 'any_question',
      });
      expect(survey).toBeTruthy();
      expect(survey.question).toBe('any_question');
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany(mockSurveys());

      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[1].question).toBe('other_question');
      expect(surveys[0].id).toBeTruthy();
    });

    test('Should load empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockSurveyData());

      const sut = makeSut();
      const surveys = await sut.loadById(res.ops[0]._id);

      expect(surveys).toBeTruthy();
      expect(surveys.id).toBeTruthy();
    });
  });
});
