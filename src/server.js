import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyStatic from '@fastify/static';
import { createDatabase } from './db.js';
import { buildApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const db = createDatabase(path.join(root, 'data', 'pitfall.sqlite'));
const app = buildApp({ db });

app.get('/', async (request, reply) => reply.sendFile('app.html'));

await app.register(fastifyStatic, {
  root,
  prefix: '/',
  decorateReply: true
});

const port = Number(process.env.PORT || 8791);
const host = process.env.HOST || '127.0.0.1';

try {
  await app.listen({ port, host });
  console.log(`Pitfall running at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
