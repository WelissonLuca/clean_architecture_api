import { ISaveSurveyResultRepository } from '@data/protocols/db/survey/save-survey-result';
import { SurveyResultModel } from '@domain/models/survey-result';
import { SaveSurveyResultModel } from '@domain/useCases/save-survey-result';

import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository
  implements ISaveSurveyResultRepository
{
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    );

    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnOriginal: false,
      }
    );

    return surveyResult.value && MongoHelper.map(surveyResult.value);
  }
}
