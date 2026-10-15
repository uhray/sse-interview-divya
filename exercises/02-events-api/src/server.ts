import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { createSeededDb } from './seed.js';

const app = createApp(await createSeededDb());
const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port });
console.log(`events-api on http://localhost:${port}  (try: Authorization: Bearer u_alice-token)`);
