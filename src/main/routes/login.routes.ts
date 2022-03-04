import { Router } from 'express';

import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeSignupController } from '../factories/signup/signup-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()));
};
