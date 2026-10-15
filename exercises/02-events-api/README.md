# Exercise 2: Code review

A small slice of the API behind our driver mobile app (about 250k users). Drivers post,
like and share. Points reward activity and show up on a public leaderboard, and top
earners get monthly gift cards.

- `src/routes/`: endpoints (`posts`, `me`)
- `src/points.ts`: how points are awarded
- `src/db.ts`: in-memory stand-in for MongoDB; `src/indexes.ts` lists the prod indexes

```sh
npm run events:dev          # http://localhost:3000, auth with `Authorization: Bearer u_alice-token`
npx vitest exercises/02-events-api
```

## The task

A teammate has opened a pull request in this repo. Review it the way you would a real PR
from a colleague: leave comments on GitHub, and tell us what you'd want changed before
it merges. Prioritize, since not every comment is equally important.
