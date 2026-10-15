import { createMiddleware } from 'hono/factory';
import type { Db, User } from './db.js';

export type AppEnv = { Variables: { user: User } };

export const requireUser = (db: Db) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const token = c.req.header('authorization')?.replace(/^Bearer /, '');
    const session = token ? await db.sessions.findOne({ token }) : null;
    const user = session ? await db.users.findOne({ _id: session.userId }) : null;
    if (!user) return c.json({ error: 'unauthorized' }, 401);
    c.set('user', user);
    await next();
  });
