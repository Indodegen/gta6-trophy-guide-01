// Tiny static server for trying the guide locally: serves app/ at http://localhost:8080.
// Node 22, standard library only. Usage: node serve.ts
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(fileURLToPath(new URL('.', import.meta.url)), 'app');
const mimeByExtension = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer(async (request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  const file = join(appRoot, path === '/' ? 'index.html' : path);
  if (!file.startsWith(appRoot)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': mimeByExtension[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(8080, '127.0.0.1', () => console.log('Leonida Platinum at http://localhost:8080'));
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('Port 8080 is already in use — stop the other server first, then run node serve.ts again.');
    process.exit(1);
  }
  throw error;
});
