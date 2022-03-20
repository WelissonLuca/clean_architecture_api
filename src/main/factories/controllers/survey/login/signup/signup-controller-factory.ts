import { SignupController } from '../../../../../../presentations/controllers/login/signup/signup-controller';
import { IController } from '../../../../../../presentations/protocols';
import { makeLogControllerDecorator } from '../../../../decorators/logger-controller-decorator-factory';
import { makeDbAddAccount } from '../../../../usecases/account/add-account/db-add-account-factory';
import { makeDbAuthenticaiton } from '../../../../usecases/account/authentication/db-authentication-factory';
import { makeSignupValidation } from './signup-validation-factory';

export const makeSignupController = (): IController => {
  const controller = new SignupController(
    makeDbAddAccount(),
    makeSignupValidation(),
    makeDbAuthenticaiton()
  );
  return makeLogControllerDecorator(controller);
};
