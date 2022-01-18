import request from 'supertest';

import app from '../config/app';

describe('Cors Middleware', () => {
  test('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('acess-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
