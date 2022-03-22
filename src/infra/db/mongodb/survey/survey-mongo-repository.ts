import { IAddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository';
import { ILoadSurveysRepository } from '@data/protocols/db/survey/load-survey-repository';
import { SurveyModel } from '@domain/models/survey';
import { AddSurveyModel } from '@domain/useCases/addSurvey';

import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements IAddSurveyRepository, ILoadSurveysRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return surveys;
  }
}
