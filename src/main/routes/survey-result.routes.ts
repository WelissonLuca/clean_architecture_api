import { Router } from 'express';

import { adaptRoute } from '@main/adapters/express-route.adapter';
import { makeSaveSurveyResultController } from '@main/factories/controllers/survey/survey-result/save-survey-result/save-survey-result-controller-factory';

import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
};
