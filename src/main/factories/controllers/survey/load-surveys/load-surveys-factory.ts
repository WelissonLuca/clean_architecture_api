import { LoadSurveyController } from '../../../../../presentations/controllers/survey/load-surveys/load-surveys-controller';
import { IController } from '../../../../../presentations/protocols/controller';
import { makeLogControllerDecorator } from '../../../decorators/logger-controller-decorator-factory';
import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-surveys-factory';

export const makeLoadSurveysController = (): IController => {
  const controller = new LoadSurveyController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
