import { makeLogControllerDecorator } from '@main/factories/decorators/logger-controller-decorator-factory';
import { makeDbAuthenticaiton } from '@main/factories/usecases/account/authentication/db-authentication-factory';
import { LoginController } from '@presentations/controllers/login/login/login-controller';
import { IController } from '@presentations/protocols';

import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): IController => {
  const controller = new LoginController(
    makeDbAuthenticaiton(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(controller);
};
