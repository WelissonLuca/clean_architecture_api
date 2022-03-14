import { LoginController } from '../../../presentations/controllers/login/login/login-controller';
import { IController } from '../../../presentations/protocols/controller';
import { makeLogControllerDecorator } from '../decorators/logger-controller-decorator-factory';
import { makeLoginValidation } from '../login/login-validation-factory';
import { makeDbAuthenticaiton } from '../usecases/authentication/db-authentication-factory';

export const makeLoginController = (): IController => {
  const controller = new LoginController(
    makeDbAuthenticaiton(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(controller);
};
