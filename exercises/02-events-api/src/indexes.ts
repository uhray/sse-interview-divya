export interface IndexSpec {
  collection: 'users' | 'sessions' | 'posts' | 'likes' | 'pointsLedger';
  keys: Record<string, 1 | -1>;
  unique?: boolean;
}

// Indexes applied to the prod database on deploy. Every query path needs to be covered by one:
// collections are large (pointsLedger is ~40M documents) and unindexed queries scan.
export const INDEXES: IndexSpec[] = [
  { collection: 'sessions', keys: { token: 1 }, unique: true },
  { collection: 'posts', keys: { authorId: 1, createdAt: -1 } },
  { collection: 'likes', keys: { userId: 1, postId: 1 }, unique: true },
  { collection: 'pointsLedger', keys: { userId: 1, reason: 1, sourceId: 1 }, unique: true },
];
