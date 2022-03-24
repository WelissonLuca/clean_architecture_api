import { DbSaveSurveyResult } from '@data/useCases/survey-result/save-survey-result/save-survey-result';
import { ISaveSurveyResult } from '@domain/useCases/survey-result/save-survey-result';
import { SurveyResultMongoRepository } from '@infra/db/mongodb/survey-result/survey-result-mongo-repository';

export const makeDbSaveSurveyResult = (): ISaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
