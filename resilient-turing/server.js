process.env.NODE_ENV = 'production';
process.env.ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'change-me-in-production-env';
process.env.UV_THREADPOOL_SIZE = '2';

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname || '';

    // Prevent missing static asset requests from falling through to dynamic [locale] HTML 404
    if (pathname.startsWith('/_next/static/')) {
      const relPath = pathname.replace('/_next/static/', '');
      const filePath = path.join(__dirname, 'build_cache', 'static', relPath);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        });
        return res.end('404 Not Found');
      }
    }

    // Set Cache-Control header for HTML document pages so browsers revalidate HTML on releases
    if (!pathname.startsWith('/_next/') && !pathname.includes('.')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }

    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js Server Ready on port ${port}`);
  });
}).catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
