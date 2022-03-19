import { DbAddSurvey } from '../../../../data/useCases/add-survey/db-add-survey';
import { IAddSurvey } from '../../../../domain/useCases/addSurvey';
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbAddSurvey = (): IAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
