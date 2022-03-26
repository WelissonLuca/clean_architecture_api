import { SurveyResultModel } from '@domain/models/survey-result';
import { SaveSurveyResultParams } from '@domain/useCases/survey-result/save-survey-result';

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSurveyResultData = (): Omit<SaveSurveyResultParams, 'id'> => ({
  surveyId: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});
