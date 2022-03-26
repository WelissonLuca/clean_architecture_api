import { ISaveSurveyResultRepository } from '@data/protocols/db/survey-result/save-survey-result';
import { SurveyResultModel } from '@domain/models/survey-result';
import { SaveSurveyResultParams } from '@domain/useCases/survey-result/save-survey-result';

import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository
  implements ISaveSurveyResultRepository
{
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveysResults'
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
