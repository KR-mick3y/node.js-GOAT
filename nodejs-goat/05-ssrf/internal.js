const http = require('http');

http.createServer((req, res) => {
  if (req.url === '/flag.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('flag{url_v4l1d4t10n_m1ss1ng_1n_f3tch}');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(4006, '127.0.0.1', () => {
  console.log('Internal flag server running on 127.0.0.1:4006');
});
