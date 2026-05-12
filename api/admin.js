export const config = { runtime: 'edge' };

const TAILNET_URL = 'https://kcustom.tailf47164.ts.net/admin';
const TAILNET_PROBE = 'https://kcustom.tailf47164.ts.net/admin/login';

export default async function handler(request) {
  const xff = request.headers.get('x-forwarded-for') || '';
  const ip = (xff.split(',')[0] || '').trim() || 'unknown';

  const raw = process.env.ADMIN_ALLOWED_IPS || '';
  const allowed = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const ok = matches(ip, allowed);

  return new Response(ok ? allowedHtml(ip) : deniedHtml(ip), {
    status: ok ? 200 : 403,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'x-frame-options': 'DENY',
      'referrer-policy': 'no-referrer',
    },
  });
}

function matches(ip, list) {
  for (const entry of list) {
    if (entry === ip) return true;
    if (entry.includes('/') && cidr(ip, entry)) return true;
  }
  return false;
}

function cidr(ip, c) {
  const [base, bitsStr] = c.split('/');
  const bits = parseInt(bitsStr, 10);
  const a = v4(ip);
  const b = v4(base);
  if (a === null || b === null || !Number.isFinite(bits) || bits < 0 || bits > 32) return false;
  if (bits === 0) return true;
  const mask = (~0 << (32 - bits)) >>> 0;
  return (a & mask) === (b & mask);
}

function v4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return (((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function shellTop(title) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>${title}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%230a0b0d'/><text x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-weight='700' font-size='34' fill='%236dff8e'>K</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#0a0b0d;--panel:#11141a;--line:#1f242d;--text:#e6ebf2;--mute:#7c8896;--dim:#4f5864;--green:#6dff8e;--green-glow:rgba(109,255,142,.35);--amber:#ffb86b;--crit:#ff5b6e;--crit-glow:rgba(255,91,110,.35);--mono:'Geist Mono','JetBrains Mono',ui-monospace,Menlo,monospace;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--bg);color:var(--text);font-family:var(--mono);font-size:14px;-webkit-font-smoothing:antialiased;min-height:100vh;}
body{display:grid;place-items:center;padding:24px;}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.012) 0 1px,transparent 1px 3px),radial-gradient(120% 90% at 50% 0%,transparent 60%,rgba(0,0,0,.55) 100%);mix-blend-mode:screen;}
.card{position:relative;z-index:1;width:100%;max-width:520px;border:1px solid var(--line);background:var(--panel);padding:28px;animation:reveal .5s cubic-bezier(.2,.7,.2,1);}
@keyframes reveal{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
h1{font-size:11px;letter-spacing:.22em;color:var(--mute);text-transform:uppercase;margin-bottom:4px;}
h1 b{color:var(--text);font-weight:600;}
.sub{font-size:12px;color:var(--dim);margin-bottom:22px;letter-spacing:.04em;}
.row{padding:12px 14px;border:1px solid var(--line);background:#06080b;font-size:12.5px;letter-spacing:.04em;display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.row .label{color:var(--mute);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;flex:0 0 auto;min-width:64px;}
.row .val{color:var(--text);font-family:var(--mono);font-weight:600;letter-spacing:.06em;}
.row.allow .val{color:var(--green);}
.row.deny .val{color:var(--crit);}
.led{flex:0 0 auto;width:10px;height:10px;border-radius:50%;background:var(--amber);box-shadow:0 0 8px rgba(255,184,107,.45);animation:pulse 1s ease-in-out infinite;}
.led.ok{background:var(--green);box-shadow:0 0 8px var(--green-glow);animation:none;}
.led.err{background:var(--crit);box-shadow:0 0 10px var(--crit-glow);animation:none;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
.status{padding:14px;border:1px solid var(--line);background:#06080b;font-size:12.5px;letter-spacing:.04em;margin-top:10px;min-height:70px;display:flex;align-items:center;gap:12px;}
.status .msg b{color:var(--text);}
.status .msg .small{color:var(--mute);font-size:11.5px;display:block;margin-top:4px;}
.actions{margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;}
.btn{flex:1;text-decoration:none;text-align:center;background:var(--green);color:#0a0b0d;font-family:var(--mono);font-weight:700;font-size:12px;letter-spacing:.22em;text-transform:uppercase;padding:13px 14px;border:none;cursor:pointer;box-shadow:0 0 18px var(--green-glow);transition:filter .15s ease;min-width:140px;}
.btn.ghost{background:transparent;color:var(--mute);border:1px solid var(--line);box-shadow:none;}
.btn:hover{filter:brightness(1.1);}
.meta{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase;display:flex;justify-content:space-between;}
.banner{padding:14px 16px;border:1px solid var(--crit);background:rgba(255,91,110,.06);color:var(--crit);font-size:13px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:16px;text-align:center;}
@media (max-width:880px){body::before{display:none;}body{padding:16px;}.card{padding:22px;}}
</style>
</head>
<body>`;
}

function shellBottom() {
  return `</body></html>`;
}

function allowedHtml(ip) {
  const sip = esc(ip);
  return `${shellTop('HUMMUS_DEV // AUTH GATE')}
<main class="card">
  <h1><b>HUMMUS_DEV</b> &nbsp;/&nbsp; restricted endpoint</h1>
  <p class="sub">IP verified &middot; checking tailnet reachability</p>

  <div class="row allow">
    <span class="led ok"></span>
    <span class="label">IP</span>
    <span class="val">${sip}</span>
    <span class="label" style="margin-left:auto;">Authorized</span>
  </div>

  <div class="status" id="status">
    <span class="led" id="led"></span>
    <div class="msg" id="msg">
      <b>Probing tailnet&hellip;</b>
      <span class="small">Checking reachability to kcustom.tailf47164.ts.net</span>
    </div>
  </div>

  <div class="actions">
    <a id="goto" class="btn" href="${TAILNET_URL}">[ENTER]</a>
    <a class="btn ghost" href="https://tailscale.com/download" target="_blank" rel="noopener">[INSTALL TAILSCALE]</a>
  </div>

  <div class="meta">
    <span>karim@hummus-dev</span>
    <span id="ts">&mdash;</span>
  </div>
</main>

<script>
(function(){
  var TAILNET_URL = ${JSON.stringify(TAILNET_URL)};
  var TAILNET_PROBE = ${JSON.stringify(TAILNET_PROBE)};
  var led = document.getElementById('led');
  var msg = document.getElementById('msg');
  var ts = document.getElementById('ts');
  ts.textContent = new Date().toISOString().slice(0,19) + 'Z';
  function show(state, title, sub){
    led.className = 'led ' + state;
    msg.innerHTML = '<b>' + title + '</b><span class="small">' + sub + '</span>';
  }
  var done = false;
  var controller = new AbortController();
  var timeout = setTimeout(function(){
    if(done) return; done = true; controller.abort();
    show('err','Tailscale not detected.','Open Tailscale on this device and toggle it ON, then reload. If not installed, tap [INSTALL TAILSCALE].');
  }, 4000);
  fetch(TAILNET_PROBE, { mode:'no-cors', signal: controller.signal, cache:'no-store' })
    .then(function(){
      if(done) return; done = true; clearTimeout(timeout);
      show('ok','Tailnet reachable. Bouncing to admin&hellip;','You should land at the login page in a moment.');
      setTimeout(function(){ window.location.href = TAILNET_URL; }, 400);
    })
    .catch(function(){
      if(done) return; done = true; clearTimeout(timeout);
      show('err','Tailscale not detected.','Open Tailscale on this device and toggle it ON, then reload.');
    });
})();
</script>
${shellBottom()}`;
}

function deniedHtml(ip) {
  const sip = esc(ip);
  return `${shellTop('HUMMUS_DEV // ACCESS DENIED')}
<main class="card">
  <div class="banner">&times; INVALID IP &middot; ACCESS DENIED</div>

  <h1><b>HUMMUS_DEV</b> &nbsp;/&nbsp; restricted endpoint</h1>
  <p class="sub">Your IP is not on the allowlist.</p>

  <div class="row deny">
    <span class="led err"></span>
    <span class="label">IP</span>
    <span class="val">${sip}</span>
    <span class="label" style="margin-left:auto;">Blocked</span>
  </div>

  <div class="status">
    <span class="led err"></span>
    <div class="msg">
      <b>No further action available.</b>
      <span class="small">This endpoint is restricted to specific networks. If you reached this page in error, contact the operator.</span>
    </div>
  </div>

  <div class="meta">
    <span>karim@hummus-dev</span>
    <span>${new Date().toISOString().slice(0,19)}Z</span>
  </div>
</main>
${shellBottom()}`;
}
