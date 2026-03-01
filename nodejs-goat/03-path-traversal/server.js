const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const FILES_DIR = path.join(__dirname, 'files');

const CSS = `
<style>
:root {
  --bg: #f5f5f5; --surface: #ffffff; --primary: #0a1628;
  --accent: #1a56db; --border: #d1d5db; --text: #111827;
  --muted: #6b7280; --danger: #b91c1c; --code-bg: #f0f2f5;
}
* { border-radius: 0 !important; box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); font-family: -apple-system, 'Segoe UI', sans-serif; color: var(--text); }
header { background: var(--primary); color: #fff; padding: 14px 32px; display: flex; align-items: center; gap: 16px; }
header h1 { font-size: 18px; font-weight: 600; }
header span { font-size: 12px; color: #94a3b8; background: #1e3a5f; padding: 2px 8px; }
.container { max-width: 860px; margin: 40px auto; padding: 0 20px; }
.card { background: var(--surface); border: 1px solid var(--border); padding: 24px; margin-bottom: 20px; }
.card h2 { font-size: 16px; font-weight: 600; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
.btn { background: var(--accent); color: #fff; border: none; padding: 6px 16px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
.btn:hover { background: #1447c0; }
code { background: var(--code-bg); font-family: 'Courier New', monospace; padding: 2px 6px; font-size: 13px; }
.file-list { list-style: none; }
.file-list li { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
.file-list li:last-child { border-bottom: none; }
.file-name { font-family: 'Courier New', monospace; font-size: 14px; }
.file-icon { color: var(--muted); margin-right: 8px; }
.meta { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.meta span { margin-right: 16px; }
</style>`;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Document Viewer - Path Traversal Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>03 - Path Traversal</span></header>
<div class="container">
<div class="card">
<h2>Document Viewer</h2>
<div class="meta">
  <span><strong>Attack Type:</strong> Path Traversal</span>
  <span><strong>Flag:</strong> /root/flag.txt</span>
</div>
<p style="font-size:14px;color:#6b7280;margin-bottom:16px">Available documents:</p>
<ul class="file-list">
  <li>
    <span><span class="file-icon">&#128196;</span><span class="file-name">readme.txt</span></span>
    <a href="/files/readme.txt" class="btn">View</a>
  </li>
  <li>
    <span><span class="file-icon">&#128196;</span><span class="file-name">user-guide.txt</span></span>
    <a href="/files/user-guide.txt" class="btn">View</a>
  </li>
  <li>
    <span><span class="file-icon">&#128196;</span><span class="file-name">sample.csv</span></span>
    <a href="/files/sample.csv" class="btn">View</a>
  </li>
</ul>
</div>
</div>
</body></html>`);
});

app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(FILES_DIR, filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.type('text/plain').send(data);
  });
});

app.listen(4003, () => console.log('Path Traversal lab running on :4003'));
