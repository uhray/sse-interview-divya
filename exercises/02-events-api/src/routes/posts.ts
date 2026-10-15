import { Hono } from 'hono';
import { z } from 'zod';
import { requireUser, type AppEnv } from '../auth.js';
import { DuplicateKeyError, type Db } from '../db.js';
import { POINTS, awardPoints } from '../points.js';

const createPostBody = z.object({
  body: z.string().trim().min(1).max(2000),
});

export function postsRoutes(db: Db) {
  const app = new Hono<AppEnv>();
  app.use('*', requireUser(db));

  app.post('/', async (c) => {
    const parsed = createPostBody.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'invalid body' }, 400);

    const user = c.get('user');
    const { insertedId } = await db.posts.insertOne({
      authorId: user._id,
      body: parsed.data.body,
      likeCount: 0,
      shareCount: 0,
      createdAt: new Date(),
    });
    return c.json({ id: insertedId }, 201);
  });

  app.get('/:id', async (c) => {
    const post = await db.posts.findOne({ _id: c.req.param('id') });
    if (!post) return c.json({ error: 'not found' }, 404);
    return c.json(post);
  });

  app.post('/:id/like', async (c) => {
    const user = c.get('user');
    const post = await db.posts.findOne({ _id: c.req.param('id') });
    if (!post) return c.json({ error: 'not found' }, 404);

    try {
      await db.likes.insertOne({ userId: user._id, postId: post._id, createdAt: new Date() });
    } catch (err) {
      if (err instanceof DuplicateKeyError) return c.json({ liked: true });
      throw err;
    }
    await db.posts.updateOne({ _id: post._id }, { $inc: { likeCount: 1 } });

    if (post.authorId !== user._id) {
      await awardPoints(db, {
        userId: post.authorId,
        reason: 'postLiked',
        sourceId: `${post._id}:${user._id}`,
        amount: POINTS.postLiked,
      });
    }
    return c.json({ liked: true });
  });

  return app;
}
