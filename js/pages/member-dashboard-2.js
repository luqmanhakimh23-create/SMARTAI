const user = renderShell('dashboard');
if (user) {
  var root = document.getElementById('page-content');
  root.innerHTML = '<div style="padding:2.5rem;text-align:center;color:var(--text-muted)">Memuat dashboard…</div>';
  function fmt(n) {
    if (window.SmartAIMT5 && SmartAIMT5.formatUSD) return SmartAIMT5.formatUSD(n);
    if (!Number.isFinite(Number(n))) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(n));
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
  }
  function greeting() {
    var h = new Date().getHours();
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 18) return 'Selamat sore';
    return 'Selamat malam';
  }
  function copyText(text, btn) {
    function ok() { var o = btn.textContent; btn.textContent = 'Tersalin ✓'; setTimeout(function(){ btn.textContent = o; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok).catch(ok);
    else ok();
  }
  var mockAccounts = [
    { account_id: 'ACC01', package: 'Basic', equity: 98984, balance: 94018, daily_profit: 4966, status: 'active' },
    { account_id: 'ACC02', package: 'Gold', equity: 109525, balance: 107868, daily_profit: 1657, status: 'active' },
    { account_id: 'ACC03', package: 'Pro', equity: 714190, balance: 669208, daily_profit: 44982, status: 'active' }
  ];
  function normalizeAcc(a) {
    if (!a) return null;
    var equity = Number(a.equity) || 0;
    var daily = Number(a.daily_profit != null ? a.daily_profit : (a.daily != null ? a.daily : 0)) || 0;
    var dailyPct = equity > 0 ? (daily / equity * 100) : 0;
    return {
      id: a.account_id || a.id || '—',
      pkg: a.package || a.pkg || a.name || 'Account',
      equity: equity,
      balance: Number(a.balance) || 0,
      daily: daily,
      dailyPct: dailyPct,
      status: a.status || 'active'
    };
  }
  function renderDashboard(rawList) {
    var list = (rawList && rawList.length) ? rawList : mockAccounts;
    var accounts = list.map(normalizeAcc).filter(Boolean);
    var totalEquity = accounts.reduce(function(s,a){ return s + a.equity; }, 0);
    var totalDaily = accounts.reduce(function(s,a){ return s + a.daily; }, 0);
    var avgPct = accounts.length ? (accounts.reduce(function(s,a){ return s + a.dailyPct; }, 0) / accounts.length) : 0;
    var refCode = (user.referralCode || user.refCode || 'SMARTDEMO').toUpperCase();
    var refLink = location.origin + '/daftar.html?ref=' + encodeURIComponent(refCode);
    var cards = accounts.map(function(a) {
      var up = a.daily >= 0;
      return '<div class="acc-card"><div class="top"><span class="pkg">' + esc(a.pkg) + '</span><span class="live-pill"><i></i> Live</span></div><div class="aid">' + esc(a.id) + '</div><div class="meta">Equity · Balance</div><div class="acc-metrics"><div class="acc-metric"><div class="l">Equity</div><div class="v">' + fmt(a.equity) + '</div></div><div class="acc-metric"><div class="l">Balance</div><div class="v">' + fmt(a.balance) + '</div></div><div class="acc-metric"><div class="l">Daily P/L</div><div class="v ' + (up?'':'neg') + '">' + (up?'+':'') + fmt(a.daily) + '</div></div><div class="acc-metric"><div class="l">Daily %</div><div class="v ' + (up?'':'neg') + '">' + (up?'+':'') + a.dailyPct.toFixed(2) + '%</div></div></div></div>';
    }).join('');
    root.innerHTML =
      '<div class="dash-hero"><h1>' + greeting() + ', ' + esc(user.nama || user.name || 'Member') + ' <span class="live-pill"><i></i> Active</span></h1><p>Dashboard member Smart AI · Data real-time</p></div>' +
      '<div class="stat-row">' +
        '<div class="stat-box"><div class="bar"></div><div class="label">Total Equity</div><div class="value">' + fmt(totalEquity) + '</div><div class="hint">' + accounts.length + ' akun aktif</div></div>' +
        '<div class="stat-box"><div class="bar"></div><div class="label">Daily Profit</div><div class="value up">' + (totalDaily>=0?'+':'') + fmt(totalDaily) + '</div><div class="hint">Hari ini</div></div>' +
        '<div class="stat-box"><div class="bar"></div><div class="label">Avg Daily %</div><div class="value up">+' + avgPct.toFixed(2) + '%</div><div class="hint">Rata-rata akun</div></div>' +
        '<div class="stat-box"><div class="bar"></div><div class="label">Referral Code</div><div class="value" style="font-size:1.05rem">' + esc(refCode) + '</div><div class="hint"><button id="dash-copy-code" class="btn" style="padding:.25rem .6rem;font-size:.72rem;margin-top:.3rem">Salin</button></div></div>' +
      '</div>' +
      '<div class="charts-row">' +
        '<div class="chart-card"><h3>Equity per akun</h3><p class="sub">Perbandingan equity live</p><div class="chart-wrap"><canvas id="dash-chart-equity"></canvas></div></div>' +
        '<div class="chart-card"><h3>Daily profit</h3><p class="sub">Profit / loss hari ini</p><div class="chart-wrap"><canvas id="dash-chart-daily"></canvas></div></div>' +
      '</div>' +
      '<h2 style="font-size:1rem;margin:0 0 .9rem">Akun MT5</h2>' +
      '<div class="acc-grid">' + cards + '</div>' +
      '<div class="bottom-grid">' +
        '<div class="panel"><h3>Profil member</h3><div style="display:flex;gap:.85rem;align-items:center;margin-bottom:.85rem"><div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--cyan),var(--teal));display:flex;align-items:center;justify-content:center;font-weight:800;color:#1c1300">' + esc((user.nama||'SA').split(/\s+/).map(function(p){return p[0];}).join('').slice(0,2).toUpperCase()) + '</div><div><b>' + esc(user.nama || 'Member') + '</b><div style="font-size:.78rem;color:var(--text-muted)">' + esc(user.email || '') + '</div></div></div><div style="font-size:.85rem;color:var(--text-muted)">WhatsApp: <b style="color:var(--text)">' + esc(user.hp || '—') + '</b></div><div style="font-size:.85rem;color:var(--text-muted);margin-top:.35rem">Referral: <b style="color:var(--cyan)">' + esc(refCode) + '</b> <button id="dash-copy-link" class="btn" style="padding:.2rem .5rem;font-size:.7rem;margin-left:.4rem">Salin link</button></div></div>' +
        '<div class="panel"><h3>Quick access</h3><div class="qa"><a href="ea-performance.html">Acc Performance</a><a href="trading-report.html">Trading Report</a><a href="commission.html">Commission</a><a href="referral.html">Referral</a><a href="transactions.html">Transactions</a><a href="profile.html">My Profile</a><a href="../testimoni.html">Testimoni</a><a href="../index.html">Landing Page</a></div></div></div>';
    var btnCode = document.getElementById('dash-copy-code');
    var btnLink = document.getElementById('dash-copy-link');
    if (btnCode) btnCode.onclick = function(){ copyText(refCode, this); };
    if (btnLink) btnLink.onclick = function(){ copyText(refLink, this); };
    setTimeout(function() {
      if (typeof Chart === 'undefined') return;
      var labels = accounts.map(function(a){ return a.id; });
      var equityData = accounts.map(function(a){ return a.equity; });
      var dailyData = accounts.map(function(a){ return a.daily; });
      var dark = document.documentElement.getAttribute('data-theme') !== 'light';
      var gridColor = dark ? 'rgba(148,163,184,.12)' : 'rgba(71,85,105,.12)';
      var textColor = dark ? 'rgba(148,163,184,.9)' : 'rgba(71,85,105,.9)';
      var eqCtx = document.getElementById('dash-chart-equity');
      if (eqCtx) new Chart(eqCtx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Equity', data: equityData, backgroundColor: 'rgba(59,139,255,.55)', borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } } } });
      var dCtx = document.getElementById('dash-chart-daily');
      if (dCtx) new Chart(dCtx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Daily', data: dailyData, backgroundColor: dailyData.map(function(v){ return v>=0 ? 'rgba(52,211,153,.55)' : 'rgba(248,113,113,.55)'; }), borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } } } });
    }, 80);
  }
  try {
    if (window.SmartAIMT5 && typeof SmartAIMT5.getAccounts === 'function') {
      SmartAIMT5.getAccounts().then(function(accs) { renderDashboard(accs && accs.length ? accs : null); }).catch(function(){ renderDashboard(null); });
    } else { renderDashboard(null); }
  } catch (e) { renderDashboard(null); }
}
