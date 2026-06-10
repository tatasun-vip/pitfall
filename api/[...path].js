import { buildApp } from '../src/app.js';
import { createDatabase } from '../src/db.js';

let appPromise;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const db = await createDatabase();
      const app = buildApp({ db });
      await app.ready();
      return app;
    })();
  }
  return appPromise;
}

export default async function handler(request, response) {
  const app = await getApp();
  app.server.emit('request', request, response);
}
