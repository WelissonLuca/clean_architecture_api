import { DbAddSurvey } from '@data/useCases/survey/add-survey/db-add-survey';
import { IAddSurvey } from '@domain/useCases/survey/addSurvey';
import { SurveyMongoRepository } from '@infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbAddSurvey = (): IAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
