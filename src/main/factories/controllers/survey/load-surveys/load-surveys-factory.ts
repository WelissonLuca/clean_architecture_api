import { makeLogControllerDecorator } from '@main/factories/decorators/logger-controller-decorator-factory';
import { makeDbLoadSurveys } from '@main/factories/usecases/survey/load-surveys/db-load-surveys-factory';
import { LoadSurveyController } from '@presentations/controllers/survey/load-surveys/load-surveys-controller';
import { IController } from '@presentations/protocols/controller';

export const makeLoadSurveysController = (): IController => {
  const controller = new LoadSurveyController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
