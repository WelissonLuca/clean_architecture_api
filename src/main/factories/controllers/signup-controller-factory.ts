import { SignupController } from '../../../presentations/controllers/login/signup/signup-controller';
import { IController } from '../../../presentations/protocols';
import { makeLogControllerDecorator } from '../decorators/logger-controller-decorator-factory';
import { makeSignupValidation } from '../signup/signup-validation-factory';
import { makeDbAddAccount } from '../usecases/add-account/db-add-account-factory';
import { makeDbAuthenticaiton } from '../usecases/authentication/db-authentication-factory';

export const makeSignupController = (): IController => {
  const controller = new SignupController(
    makeDbAddAccount(),
    makeSignupValidation(),
    makeDbAuthenticaiton()
  );
  return makeLogControllerDecorator(controller);
};
