const express = require('express');
const axios = require('axios');

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
label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 4px; margin-top: 12px; }
input { border: 1px solid var(--border); padding: 8px 12px; width: 100%; font-size: 14px; }
.btn { background: var(--accent); color: #fff; border: none; padding: 8px 20px; cursor: pointer; font-size: 14px; margin-top: 16px; }
.btn:hover { background: #1447c0; }
pre { background: var(--code-bg); font-family: 'Courier New', monospace; padding: 16px; overflow-x: auto; font-size: 13px; min-height: 80px; white-space: pre-wrap; word-break: break-all; margin-top: 8px; }
.result-label { font-size: 13px; color: var(--muted); margin-top: 16px; margin-bottom: 4px; }
.meta { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.meta span { margin-right: 16px; }
</style>`;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Webhook Monitor - SSRF Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>05 - SSRF</span></header>
<div class="container">
<div class="card">
<h2>Webhook Health Monitor</h2>
<div class="meta">
  <span><strong>Attack Type:</strong> SSRF</span>
  <span><strong>Flag:</strong> localhost:4006/flag.txt (서버 내부에서만 접근 가능)</span>
</div>
<div style="border:1px solid var(--border);padding:12px 16px;margin-bottom:16px;font-size:13px;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
    <span style="font-weight:600;">Corporate Webhook Endpoint</span>
    <span style="font-size:11px;color:var(--muted);">Last checked: just now</span>
  </div>
  <div style="color:var(--muted);font-family:monospace;font-size:12px;">https://hooks.corp-internal.net/health</div>
</div>
<button class="btn" onclick="checkHealth()">상태 확인</button>
<div class="result-label" style="margin-top:16px;margin-bottom:4px;">Response:</div>
<pre id="output">대기 중...</pre>
</div>
</div>
<script>
async function checkHealth() {
  document.getElementById('output').textContent = '요청 중...';
  try {
    const r = await fetch('/api/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://hooks.corp-internal.net/health' })
    });
    const d = await r.json();
    if (d.error) {
      document.getElementById('output').textContent = 'Error: ' + d.error;
    } else {
      const data = typeof d.data === 'string' ? d.data : JSON.stringify(d.data, null, 2);
      document.getElementById('output').textContent = data;
    }
  } catch (e) {
    document.getElementById('output').textContent = 'Request failed: ' + e.message;
  }
}
</script></body></html>`);
});

app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  try {
    const response = await axios.get(url, { timeout: 5000, responseType: 'text' });
    res.json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4005, () => console.log('SSRF lab running on :4005'));
