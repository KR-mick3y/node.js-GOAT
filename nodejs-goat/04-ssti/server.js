const express = require('express');
const ejs = require('ejs');

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
.search-row { display: flex; gap: 8px; }
.search-row input { flex: 1; border: 1px solid var(--border); padding: 8px 12px; font-size: 14px; }
.btn { background: var(--accent); color: #fff; border: none; padding: 8px 20px; cursor: pointer; font-size: 14px; }
.btn:hover { background: #1447c0; }
code { background: var(--code-bg); font-family: 'Courier New', monospace; padding: 2px 6px; font-size: 13px; }
.results { margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px; }
.results p { font-size: 14px; }
.error-box { background: #fef2f2; border: 1px solid #fecaca; padding: 12px 16px; color: var(--danger); font-size: 13px; font-family: 'Courier New', monospace; }
.meta { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.meta span { margin-right: 16px; }
</style>`;

function buildPage(content, query) {
  return `<!DOCTYPE html><html><head><title>Search Portal - SSTI Lab</title>${CSS}</head><body>
<header><h1>Node.js GOAT</h1><span>04 - SSTI / EJS Injection</span></header>
<div class="container">
<div class="card">
<h2>Search Portal</h2>
<div class="meta">
  <span><strong>Attack Type:</strong> SSTI (EJS Injection)</span>
  <span><strong>Flag:</strong> /root/flag.txt</span>
</div>
<form method="GET" action="/search">
<div class="search-row">
  <input type="text" name="q" placeholder="Search products, documents..." value="${(query || '').replace(/"/g, '&quot;')}">
  <button type="submit" class="btn">Search</button>
</div>
</form>
${content}
</div>
</div>
</body></html>`;
}

app.get('/', (req, res) => res.redirect('/search'));

app.get('/search', (req, res) => {
  const query = req.query.q || '';
  if (!query) {
    return res.send(buildPage('', query));
  }
  try {
    const template = `<div class="results"><p>Search results for: ${query}</p></div>`;
    const rendered = ejs.render(template, { require });
    res.send(buildPage(rendered, query));
  } catch (err) {
    const errHtml = `<div class="results"><div class="error-box">Template Error: ${err.message}</div></div>`;
    res.send(buildPage(errHtml, query));
  }
});

app.listen(4004, () => console.log('SSTI lab running on :4004'));
