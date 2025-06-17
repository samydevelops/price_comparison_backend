import app from './server';
import { serve } from '@hono/node-server';

serve({ fetch: app.fetch, port: 4000 }, () => {
  console.log('Hono server running at http://localhost:4000');
});