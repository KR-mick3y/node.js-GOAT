const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
.btn { background: var(--accent); color: #fff; border: none; padding: 10px 24px; cursor: pointer; font-size: 14px; }
.btn:hover { background: #1447c0; }
pre { background: var(--code-bg); font-family: 'Courier New', monospace; padding: 16px; overflow-x: auto; font-size: 13px; min-height: 60px; white-space: pre-wrap; word-break: break-all; }
.result-label { font-size: 13px; color: var(--muted); margin-top: 16px; margin-bottom: 8px; }
.status-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.status-dot { width: 8px; height: 8px; background: #16a34a; border-radius: 50%; display: inline-block; }
.status-text { font-size: 13px; color: var(--muted); }
.meta { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.meta span { margin-right: 16px; }
</style>`;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Server Monitor - Command Injection Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>02 - Command Injection</span></header>
<div class="container">
<div class="card">
<h2>Server Monitor</h2>
<div class="meta">
  <span><strong>Attack Type:</strong> Command Injection</span>
  <span><strong>Flag:</strong> /root/flag.txt</span>
</div>
<div class="status-row">
  <span class="status-dot"></span>
  <span class="status-text">Target: 127.0.0.1</span>
</div>
<button class="btn" onclick="runCheck()">연결 테스트</button>
<div class="result-label">Output:</div>
<pre id="output">대기 중...</pre>
</div>
</div>
<script>
async function runCheck() {
  document.getElementById('output').textContent = '실행 중...';
  const r = await fetch('/api/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: '127.0.0.1' })
  });
  const d = await r.json();
  document.getElementById('output').textContent = d.result || d.error || 'No output';
}
</script></body></html>`);
});

app.post('/api/ping', (req, res) => {
  const host = req.body.host;
  if (!host) return res.json({ error: 'No host provided' });
  exec(`ping -c 2 ${host}`, { timeout: 10000 }, (err, stdout, stderr) => {
    res.json({ result: stdout + stderr });
  });
});

app.listen(4002, () => console.log('Command Injection lab running on :4002'));
