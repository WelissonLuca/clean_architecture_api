import { Router } from 'express';

import { adaptRoute } from '../adapters/express/express-route.adapter';
import { makeLoginController } from '../factories/login/login-factory';
import { makeSignupController } from '../factories/signup/signup-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
