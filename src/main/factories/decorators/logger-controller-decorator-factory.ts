import { LogMongoRepository } from '@infra/db/mongodb/log/log-mongo-repository';
import { LogControllerDecorator } from '@main/decorators/log-controller-decorator';
import { IController } from '@presentations/protocols';

export const makeLogControllerDecorator = (
  controller: IController
): IController => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
