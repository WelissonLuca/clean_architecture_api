import { LoginController } from '../../../../../../presentations/controllers/login/login/login-controller';
import { IController } from '../../../../../../presentations/protocols';
import { makeLogControllerDecorator } from '../../../../decorators/logger-controller-decorator-factory';
import { makeDbAuthenticaiton } from '../../../../usecases/account/authentication/db-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): IController => {
  const controller = new LoginController(
    makeDbAuthenticaiton(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(controller);
};
