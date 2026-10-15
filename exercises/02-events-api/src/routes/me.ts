import { Hono } from 'hono';
import { requireUser, type AppEnv } from '../auth.js';
import type { Db } from '../db.js';

export function meRoutes(db: Db) {
  const app = new Hono<AppEnv>();
  app.use('*', requireUser(db));

  app.get('/', (c) => {
    const { _id, displayName, points } = c.get('user');
    return c.json({ id: _id, displayName, points });
  });

  return app;
}
