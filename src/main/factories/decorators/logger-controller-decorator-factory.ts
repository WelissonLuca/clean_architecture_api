import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { IController } from '../../../presentations/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';

export const makeLogControllerDecorator = (
  controller: IController
): IController => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
