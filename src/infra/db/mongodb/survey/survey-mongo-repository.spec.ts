import { Collection } from 'mongodb';

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
  test('Should add a survey on success', async () => {
    const sut = makeSut();

    await sut.add({
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'any_answer',
        },
      ],
      question: 'any_question',
      date: new Date(),
    });

    const survey = await surveyCollection.findOne({ question: 'any_question' });
    expect(survey).toBeTruthy();
    expect(survey.question).toBe('any_question');
  });
});
