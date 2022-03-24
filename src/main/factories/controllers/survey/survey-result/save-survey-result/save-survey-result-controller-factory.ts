import { makeLogControllerDecorator } from '@main/factories/decorators/logger-controller-decorator-factory';
import { makeDbLoadSurveyById } from '@main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory';
import { makeDbSaveSurveyResult } from '@main/factories/usecases/survey/survey-result/save-survey-result/db-save-survey-result-factory';
import { SaveSurveyResultController } from '@presentations/controllers/survey-result/save-survey-result/save-survey-result';
import { IController } from '@presentations/protocols/controller';

export const makeSaveSurveyResultController = (): IController => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
