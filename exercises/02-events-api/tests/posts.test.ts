import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import type { Db } from '../src/db.js';
import { createSeededDb } from '../src/seed.js';

let db: Db;
let app: ReturnType<typeof createApp>;

const as = (userId: string) => ({ Authorization: `Bearer ${userId}-token` });

beforeEach(async () => {
  db = await createSeededDb();
  app = createApp(db);
});

describe('POST /posts/:id/like', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await app.request('/posts/p_1/like', { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('counts a like and rewards the author once', async () => {
    await app.request('/posts/p_1/like', { method: 'POST', headers: as('u_bob') });
    await app.request('/posts/p_1/like', { method: 'POST', headers: as('u_bob') });

    expect((await db.posts.findOne({ _id: 'p_1' }))?.likeCount).toBe(1);
    expect((await db.users.findOne({ _id: 'u_alice' }))?.points).toBe(1);
  });

  it('does not reward liking your own post', async () => {
    await app.request('/posts/p_1/like', { method: 'POST', headers: as('u_alice') });
    expect((await db.users.findOne({ _id: 'u_alice' }))?.points).toBe(0);
  });
});

describe('POST /posts', () => {
  it('validates the body', async () => {
    const res = await app.request('/posts', {
      method: 'POST',
      headers: { ...as('u_bob'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: '' }),
    });
    expect(res.status).toBe(400);
  });
});
