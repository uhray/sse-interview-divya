import { createDb } from './db.js';

export async function createSeededDb() {
  const db = createDb();
  const users = [
    { _id: 'u_alice', displayName: 'Alice', email: 'alice@example.com', points: 0 },
    { _id: 'u_bob', displayName: 'Bob', email: 'bob@example.com', points: 0 },
  ];
  for (const u of users) {
    await db.users.insertOne(u);
    await db.sessions.insertOne({ token: `${u._id}-token`, userId: u._id });
  }
  await db.posts.insertOne({
    _id: 'p_1',
    authorId: 'u_alice',
    body: 'Anyone running I-80 through Wyoming this week? Wind advisories again.',
    likeCount: 0,
    shareCount: 0,
    createdAt: new Date(),
  });
  return db;
}
