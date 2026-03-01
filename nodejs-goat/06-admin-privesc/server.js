require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/js', express.static(path.join(__dirname, 'public/js')));

const SESSIONS_DIR = path.join(__dirname, 'sessions');
const JWT_SECRET = process.env.JWT_SECRET || 's3cr3t_k3y_d0_n0t_sh4r3';

// Pre-create alice's sample session on startup (overwrite on each restart to avoid accumulation)
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });
const aliceSid = 'alice-s4mple-s3ss10n';
fs.writeFileSync(
  path.join(SESSIONS_DIR, `${aliceSid}.json`),
  JSON.stringify({ username: 'alice', isAdmin: false, createdAt: new Date().toISOString() }, null, 2)
);

const USERS = {
  alice: 'password123'
};

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
.alert { padding: 10px 16px; margin-bottom: 16px; font-size: 14px; }
.alert-danger { background: #fef2f2; border: 1px solid #fecaca; color: var(--danger); }
code { background: var(--code-bg); font-family: 'Courier New', monospace; padding: 2px 6px; font-size: 13px; }
.flag-box { background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin-top: 16px; }
.flag-box code { font-family: 'Courier New', monospace; font-size: 15px; color: #92400e; font-weight: 700; }
.info-row { display: flex; border-bottom: 1px solid var(--border); padding: 8px 0; font-size: 14px; }
.info-row .label { width: 140px; color: var(--muted); flex-shrink: 0; }
.badge { display: inline-block; padding: 2px 10px; font-size: 12px; font-weight: 600; }
.badge-user { background: #e0e7ff; color: #3730a3; }
.badge-admin { background: #dcfce7; color: #15803d; }
.meta { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.meta span { margin-right: 16px; }
</style>`;

function getSession(req) {
  const cookie = req.cookies?.session;
  if (!cookie) return null;
  try {
    const { sid } = jwt.verify(cookie, JWT_SECRET);
    const data = fs.readFileSync(path.join(SESSIONS_DIR, `${sid}.json`), 'utf8');
    return JSON.parse(data);
  } catch (e) { return null; }
}

app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Login - Corporate Dashboard</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>06 - Admin Privilege Escalation</span></header>
<div class="container">
<div class="card">
<h2>Corporate Internal Dashboard — Login</h2>
<div class="meta">
  <span><strong>Attack Type:</strong> Admin Privilege Escalation</span>
  <span><strong>Flag:</strong> 관리자 대시보드</span>
</div>
<div id="msg"></div>
<label>Username</label><input id="u" type="text" value="alice">
<label>Password</label><input id="p" type="password" value="password123">
<button class="btn" onclick="doLogin()">Login</button>
</div>
</div>
<script src="/js/auth.js"></script>
<script src="/js/common.js"></script>
<script src="/js/main.js"></script>
<script>
async function doLogin() {
  const r = await fetch('/api/login', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: document.getElementById('u').value, password: document.getElementById('p').value })
  });
  const d = await r.json();
  if (d.ok) { window.location.href = '/'; }
  else { document.getElementById('msg').innerHTML = '<div class="alert alert-danger">' + (d.error||'Login failed') + '</div>'; }
}
</script></body></html>`);
});

app.get('/', (req, res) => {
  const session = getSession(req);
  if (!session) return res.redirect('/login');
  const { username, isAdmin } = session;
  let flagSection = '';
  if (isAdmin) {
    flagSection = `<div class="flag-box"><p style="margin-bottom:8px;font-weight:600">Admin Flag:</p><code>flag{y0u_l00ks_l1k3_4_n0d3.js_m4st3r!!!}</code></div>`;
  }
  res.send(`<!DOCTYPE html><html><head><title>Dashboard - Corporate Internal</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>06 - Admin Privilege Escalation</span></header>
<div class="container">
<div class="card">
<h2>Corporate Internal Dashboard</h2>
<div class="info-row"><span class="label">Username</span><span>${username}</span></div>
<div class="info-row"><span class="label">Role</span><span class="badge ${isAdmin ? 'badge-admin' : 'badge-user'}">${isAdmin ? 'Administrator' : 'User'}</span></div>
<div class="info-row"><span class="label">Session</span><span style="font-family:monospace;font-size:12px">Active</span></div>
${flagSection}
${!isAdmin ? '<p style="margin-top:16px;font-size:13px;color:#6b7280">You are logged in as a regular user. Admin users can see sensitive information.</p>' : ''}
</div>
</div>
<script src="/js/auth.js"></script>
<script src="/js/common.js"></script>
<script src="/js/main.js"></script>
</body></html>`);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!USERS[username] || USERS[username] !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const sid = uuidv4();
  const sessionData = { username, isAdmin: false, createdAt: new Date().toISOString() };
  fs.writeFileSync(path.join(SESSIONS_DIR, `${sid}.json`), JSON.stringify(sessionData, null, 2));
  const token = jwt.sign({ sid }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('session', token, { httpOnly: true });
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ username: session.username, isAdmin: session.isAdmin });
});

// Vulnerable API endpoints (no auth)
app.get('/api/getListFileFolder', (req, res) => {
  try {
    const dirPath = req.query.path;
    if (!dirPath) return res.status(400).json({ error: 'path required' });
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    res.json({
      items: items.map(i => ({ name: i.name, type: i.isDirectory() ? 'directory' : 'file' }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/getFileContent', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).json({ error: 'path required' });
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/writeJSON', (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || data === undefined) return res.status(400).json({ error: 'path and data required' });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4007, () => console.log('Admin Privilege Escalation lab running on :4007'));
