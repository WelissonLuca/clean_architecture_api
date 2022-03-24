import { DbLoadSurveys } from '@data/useCases/survey/db-load-surveys/db-load-surveys';
import { ILoadSurveys } from '@domain/useCases/survey/load-surveys';
import { SurveyMongoRepository } from '@infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveys = (): ILoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
