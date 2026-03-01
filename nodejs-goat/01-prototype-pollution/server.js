const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET = 'pp_secret_key_2024';
const users = {};

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
.btn-outline { background: #fff; color: var(--accent); border: 1px solid var(--accent); padding: 6px 16px; cursor: pointer; font-size: 13px; margin-top: 0; }
.btn-outline:hover { background: #eff6ff; }
.alert { padding: 10px 16px; margin-bottom: 16px; font-size: 14px; }
.alert-danger { background: #fef2f2; border: 1px solid #fecaca; color: var(--danger); }
.alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
.flag-box { background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin-top: 16px; }
.flag-box code { font-family: 'Courier New', monospace; font-size: 15px; color: #92400e; font-weight: 700; }
nav { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; }
nav a { color: var(--accent); text-decoration: none; font-size: 14px; }
nav a:hover { text-decoration: underline; }
nav .logout { margin-left: auto; background: none; border: none; color: var(--muted); font-size: 13px; cursor: pointer; padding: 0; }
nav .logout:hover { color: var(--danger); }
pre, code { background: var(--code-bg); font-family: 'Courier New', monospace; padding: 2px 6px; font-size: 13px; }
pre { padding: 12px; overflow-x: auto; }
.meta { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.meta span { margin-right: 16px; }
.info-row { display: flex; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 14px; gap: 12px; }
.info-row:last-child { border-bottom: none; }
.info-row .lbl { width: 100px; color: var(--muted); flex-shrink: 0; }
.divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
</style>`;

function hash(s) { return crypto.createHash('sha256').update(s).digest('hex'); }

function merge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const globalConfig = { appName: 'Proto-Poll App' };

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.userInfo = jwt.verify(auth.slice(7), SECRET);
    next();
  } catch (e) { res.status(401).json({ error: 'Invalid token' }); }
}

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Login - Prototype Pollution Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>01 - Prototype Pollution</span></header>
<div class="container">
<nav><a href="/login">Login</a><a href="/register">Register</a></nav>
<div class="card">
<h2>Login</h2>
<div class="meta">
  <span><strong>Attack Type:</strong> Prototype Pollution</span>
  <span><strong>Flag:</strong> /mypage (admin only)</span>
</div>
<div id="msg"></div>
<label>Username</label><input id="u" type="text" placeholder="username">
<label>Password</label><input id="p" type="password" placeholder="password">
<button class="btn" onclick="doLogin()">Login</button>
</div>
</div>
<script>
// 이미 로그인 상태면 마이페이지로
if (localStorage.getItem('token')) {
  fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
    .then(r => { if (r.ok) window.location.href = '/mypage'; });
}
async function doLogin() {
  const r = await fetch('/api/login', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: document.getElementById('u').value, password: document.getElementById('p').value })
  });
  const d = await r.json();
  if (d.token) { localStorage.setItem('token', d.token); window.location.href = '/mypage'; }
  else { document.getElementById('msg').innerHTML = '<div class="alert alert-danger">' + (d.error||'Login failed') + '</div>'; }
}
</script></body></html>`);
});

app.get('/register', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Register - Prototype Pollution Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>01 - Prototype Pollution</span></header>
<div class="container">
<nav><a href="/login">Login</a><a href="/register">Register</a></nav>
<div class="card">
<h2>Register</h2>
<div id="msg"></div>
<label>Username</label><input id="u" type="text" placeholder="username">
<label>Password</label><input id="p" type="password" placeholder="password">
<button class="btn" onclick="doRegister()">Create Account</button>
</div>
</div>
<script>
async function doRegister() {
  const r = await fetch('/api/register', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: document.getElementById('u').value, password: document.getElementById('p').value })
  });
  const d = await r.json();
  if (d.username) {
    document.getElementById('msg').innerHTML = '<div class="alert alert-success">Account created. Redirecting to login...</div>';
    setTimeout(() => window.location.href = '/login', 1200);
  } else {
    document.getElementById('msg').innerHTML = '<div class="alert alert-danger">' + (d.error||'Error') + '</div>';
  }
}
</script></body></html>`);
});

app.get('/mypage', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>My Page - Prototype Pollution Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>01 - Prototype Pollution</span></header>
<div class="container">
<nav>
  <a href="/mypage">My Page</a>
  <button class="logout" onclick="logout()">Logout</button>
</nav>
<div id="content">Loading...</div>
</div>
<script>
function logout() { localStorage.removeItem('token'); window.location.href = '/login'; }

async function load() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login'; return; }
  const r = await fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + token } });
  if (r.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; return; }
  const d = await r.json();

  let html = '<div class="card">';
  html += '<h2>My Page</h2>';
  html += '<div class="info-row"><span class="lbl">Username</span><span>' + d.username + '</span></div>';
  html += '<div class="info-row"><span class="lbl">Role</span><span>' + (d.isAdmin ? 'Administrator' : 'Regular User') + '</span></div>';
  html += '<div class="info-row"><span class="lbl">Nickname</span><span id="nick-display">' + (d.nickname || '—') + '</span></div>';
  if (d.isAdmin) {
    html += '<div class="flag-box" style="margin-top:16px"><p style="margin-bottom:8px;font-weight:600">Flag:</p><code>' + d.flag + '</code></div>';
  }
  html += '</div>';

  // 내 정보 수정 카드
  html += '<div class="card">';
  html += '<h2>내 정보 수정</h2>';
  html += '<div id="update-msg"></div>';
  html += '<label>Nickname</label><input id="nickname" type="text" placeholder="닉네임 입력" value="' + (d.nickname || '') + '">';
  html += '<label>Bio</label><input id="bio" type="text" placeholder="자기소개">';
  html += '<button class="btn" onclick="updateProfile()">저장</button>';
  html += '</div>';

  document.getElementById('content').innerHTML = html;
}

async function updateProfile() {
  const token = localStorage.getItem('token');
  const nickname = document.getElementById('nickname').value;
  const bio = document.getElementById('bio').value;
  const r = await fetch('/api/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ nickname, bio })
  });
  const d = await r.json();
  const msgEl = document.getElementById('update-msg');
  if (d.success) {
    msgEl.innerHTML = '<div class="alert alert-success">저장되었습니다.</div>';
  } else {
    msgEl.innerHTML = '<div class="alert alert-danger">저장 실패.</div>';
  }
}

load();
</script></body></html>`);
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users[username]) return res.status(400).json({ error: 'User already exists' });
  const user = { username, password: hash(password) };
  users[username] = user;
  res.json({ username, isAdmin: user.isAdmin ?? false });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== hash(password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/me', authMiddleware, (req, res) => {
  const { username } = req.userInfo;
  const user = users[username];
  if (!user) return res.status(401).json({ error: 'User not found' });
  const isAdmin = user.isAdmin ?? false;
  const resp = { username, isAdmin, nickname: user.nickname || null };
  if (isAdmin) resp.flag = 'flag{f1lt3r_und3rscor3_pr0t0_k3y}';
  res.json(resp);
});

// 취약한 업데이트 엔드포인트: 사용자 프로필 수정 (merge 검증 없음)
app.post('/api/update', authMiddleware, (req, res) => {
  const { username } = req.userInfo;
  const user = users[username];
  if (!user) return res.status(401).json({ error: 'User not found' });
  merge(user, req.body);
  res.json({ success: true });
});

app.listen(4001, () => console.log('Prototype Pollution lab running on :4001'));
