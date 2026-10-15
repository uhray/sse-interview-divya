import { DuplicateKeyError, type Db } from './db.js';

export const POINTS = {
  postLiked: 1,
} as const;

// Ledger first, balance second. The unique (userId, reason, sourceId) index makes an award
// idempotent: the same thing can't be rewarded twice, however often a client retries.
export async function awardPoints(
  db: Db,
  award: { userId: string; reason: string; sourceId: string; amount: number },
): Promise<boolean> {
  try {
    await db.pointsLedger.insertOne({ ...award, createdAt: new Date() });
  } catch (err) {
    if (err instanceof DuplicateKeyError) return false;
    throw err;
  }
  await db.users.updateOne({ _id: award.userId }, { $inc: { points: award.amount } });
  return true;
}
