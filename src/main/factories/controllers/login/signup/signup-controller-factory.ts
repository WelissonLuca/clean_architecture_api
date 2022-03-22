import { makeLogControllerDecorator } from '@main/factories/decorators/logger-controller-decorator-factory';
import { makeDbAddAccount } from '@main/factories/usecases/account/add-account/db-add-account-factory';
import { makeDbAuthenticaiton } from '@main/factories/usecases/account/authentication/db-authentication-factory';
import { SignupController } from '@presentations/controllers/login/signup/signup-controller';
import { IController } from '@presentations/protocols';

import { makeSignupValidation } from './signup-validation-factory';

export const makeSignupController = (): IController => {
  const controller = new SignupController(
    makeDbAddAccount(),
    makeSignupValidation(),
    makeDbAuthenticaiton()
  );
  return makeLogControllerDecorator(controller);
};
