import { Router, Express } from 'express';
import { readdirSync } from 'fs';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (!file.includes('.test') && !file.endsWith('.map')) {
      const route = await import(`../routes/${file}`);
      route.default(router);
    }
  });
};
