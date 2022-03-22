import { makeLogControllerDecorator } from '@main/factories/decorators/logger-controller-decorator-factory';
import { makeDbAddSurvey } from '@main/factories/usecases/survey/add-survey/db-add-survey-factory';
import { AddSurveyController } from '@presentations/controllers/survey/add-survey/add-survey-controller';
import { IController } from '@presentations/protocols/controller';

import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): IController => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );
  return makeLogControllerDecorator(controller);
};
