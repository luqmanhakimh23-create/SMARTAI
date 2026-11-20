(function () {
  var user = renderShell('performance');
  if (!user) return;
  var root = document.getElementById('page-content');
  if (!root) return;
  root.innerHTML = '<div class="page-loading"><div class="spin"></div><p>Memuat performa akun…</p></div>';
  var equityChart = null, dailyChart = null, pieChart = null;
  function fmt(n) {
    if (window.SmartAIMT5 && SmartAIMT5.formatUSD) return SmartAIMT5.formatUSD(n);
    if (!Number.isFinite(Number(n))) return '\u2014';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(n));
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function clampDaily(n) {
    n = Number(n);
    if (!Number.isFinite(n) || Math.abs(n) > 500000) return 0;
    return n;
  }
  function statusBadge(st) {
    var s = String(st || '').toUpperCase();
    if (s === 'ONLINE' || s === 'LIVE') return '<span class="badge-st on">● ' + esc(st) + '</span>';
    if (s === 'DEMO') return '<span class="badge-st demo">● DEMO</span>';
    return '<span class="badge-st off">● ' + esc(st || 'OFFLINE') + '</span>';
  }
  function chartColors() {
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      text: dark ? 'rgba(148,163,184,.9)' : 'rgba(71,85,105,.9)',
      grid: dark ? 'rgba(148,163,184,.12)' : 'rgba(71,85,105,.12)',
      cyan: 'rgba(59,139,255,.9)', green: 'rgba(52,211,153,.9)',
      blue: 'rgba(96,165,250,.9)', gold: 'rgba(251,191,36,.9)', purple: 'rgba(167,139,250,.9)'
    };
  }
  function buildCharts(accounts) {
    var c = chartColors();
    var labels = accounts.map(function (a) { return a.account_id || a.name || '—'; });
    var equities = accounts.map(function (a) { return Number(a.equity) || 0; });
    var dailies = accounts.map(function (a) { return clampDaily(a.daily_profit); });
    var palette = [c.cyan, c.gold, c.purple, c.blue, c.green];
    if (equityChart) equityChart.destroy();
    if (dailyChart) dailyChart.destroy();
    if (pieChart) pieChart.destroy();
    var eqEl = document.getElementById('chart-equity');
    var dyEl = document.getElementById('chart-daily');
    var pieEl = document.getElementById('chart-pie');
    if (!eqEl || !window.Chart) return;
    equityChart = new Chart(eqEl, {
      type: 'bar',
      data: { labels: labels, datasets: [{ label: 'Equity', data: equities, backgroundColor: labels.map(function(_,i){return palette[i%palette.length];}), borderRadius: 8, maxBarThickness: 48 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ return fmt(ctx.raw); } } } },
        scales: {
          x: { ticks: { color: c.text }, grid: { display: false } },
          y: { ticks: { color: c.text, callback: function(v){ return '$'+Number(v).toLocaleString(); } }, grid: { color: c.grid } }
        }
      }
    });
    dailyChart = new Chart(dyEl, {
      type: 'bar',
      data: { labels: labels, datasets: [{ label: 'Daily', data: dailies, backgroundColor: dailies.map(function(v){ return v>=0?c.green:'rgba(248,113,113,.85)'; }), borderRadius: 8, maxBarThickness: 48 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ return fmt(ctx.raw); } } } },
        scales: {
          x: { ticks: { color: c.text }, grid: { display: false } },
          y: { ticks: { color: c.text, callback: function(v){ return '$'+Number(v).toLocaleString(); } }, grid: { color: c.grid } }
        }
      }
    });
    if (pieEl) {
      pieChart = new Chart(pieEl, {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: equities.map(function(v){return Math.max(v,0);}), backgroundColor: labels.map(function(_,i){return palette[i%palette.length];}), borderWidth: 0, hoverOffset: 6 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '62%',
          plugins: {
            legend: { position: 'bottom', labels: { color: c.text, boxWidth: 12, padding: 12 } },
            tooltip: { callbacks: { label: function(ctx){ return ctx.label+': '+fmt(ctx.raw); } } }
          }
        }
      });
    }
  }
  async function load() {
    var accounts = [];
    try {
      if (typeof SmartAIMT5 !== 'undefined' && SmartAIMT5.getAccounts) {
        accounts = await SmartAIMT5.getAccounts(true);
        if (!accounts || !accounts.length) {
          await new Promise(function(r){ setTimeout(r, 700); });
          accounts = await SmartAIMT5.getAccounts(true);
        }
      }
    } catch (e) { accounts = []; }
    accounts = accounts || [];
    accounts.sort(function(a,b){ return String(a.account_id||'').localeCompare(String(b.account_id||'')); });
    var live = (typeof SmartAIMT5 !== 'undefined' && SmartAIMT5.isLive) ? SmartAIMT5.isLive() : false;
    var totalEq = 0, totalDaily = 0, totalProfit = 0, onlineN = 0;
    accounts.forEach(function(a){
      if (Number.isFinite(Number(a.equity))) totalEq += Number(a.equity);
      totalDaily += clampDaily(a.daily_profit);
      if (Number.isFinite(Number(a.total_profit))) totalProfit += Number(a.total_profit);
      var st = String(a.status||'').toUpperCase();
      if (st==='ONLINE'||st==='LIVE'||st==='DEMO') onlineN++;
    });
    var pkgName = { ACC01:'Smart Basic', ACC02:'Smart Gold', ACC03:'Smart Pro' };
    var cards = accounts.map(function(a){
      var daily = clampDaily(a.daily_profit);
      var dailyCls = daily < 0 ? 'neg' : (daily > 0 ? 'up' : '');
      var sub = [];
      if (a.login) sub.push('Login '+a.login);
      if (a.owner) sub.push(a.owner);
      if (a.server) sub.push(a.server);
      if (a.broker_label||a.broker) sub.push(a.broker_label||a.broker);
      return '<div class="perf-card"><div class="top"><h3>'+esc(pkgName[a.account_id]||a.name||a.account_id||'MT5')+'</h3>'+statusBadge(a.status)+'</div>'+
        '<div style="font-size:1.15rem;font-weight:800;margin-bottom:.2rem">'+esc(a.account_id||'—')+'</div>'+
        '<div class="meta">'+esc(sub.join(' · ')||'Akun trading')+(a.updated_at?'<br/>Update: '+esc(String(a.updated_at).slice(0,19).replace('T',' ')):'')+'</div>'+
        '<div class="perf-metrics">'+
          '<div><span>Balance</span><strong>'+fmt(a.balance)+'</strong></div>'+
          '<div><span>Equity</span><strong>'+fmt(a.equity)+'</strong></div>'+
          '<div><span>Daily</span><strong class="'+dailyCls+'">'+fmt(daily)+'</strong></div>'+
          '<div><span>Total profit</span><strong class="up">'+fmt(a.total_profit)+'</strong></div>'+
          '<div><span>Deposit awal</span><strong>'+fmt(a.deposit_awal)+'</strong></div>'+
          '<div><span>Penarikan</span><strong>'+fmt(a.total_penarikan)+'</strong></div></div></div>';
    }).join('');
    var rows = accounts.map(function(a){
      var daily = clampDaily(a.daily_profit);
      var dailyCls = daily < 0 ? 'neg' : (daily > 0 ? 'up' : '');
      var roi = (Number(a.deposit_awal)>0 && Number.isFinite(Number(a.total_profit)))
        ? ((Number(a.total_profit)/Number(a.deposit_awal))*100).toFixed(1)+'%' : '—';
      return '<tr><td><b>'+esc(a.account_id)+'</b><div style="font-size:.72rem;color:var(--text-muted)">'+esc(pkgName[a.account_id]||a.name||'')+'</div></td>'+
        '<td>'+statusBadge(a.status)+'</td><td>'+fmt(a.balance)+'</td><td>'+fmt(a.equity)+'</td>'+
        '<td class="'+dailyCls+'">'+fmt(daily)+'</td><td class="up">'+fmt(a.total_profit)+'</td>'+
        '<td>'+fmt(a.total_penarikan)+'</td><td>'+esc(roi)+'</td></tr>';
    }).join('');
    root.innerHTML =
      '<div class="perf-hero"><div><h1>Acc Performance</h1><p>Ringkasan equity, profit harian, dan status semua akun MT5 kamu.</p></div>'+
        (live?'<span class="live-pill"><i></i> Live data</span>':'<span class="live-pill" style="border-color:var(--border);background:rgba(255,255,255,.04);color:var(--text-muted)">Demo / cache</span>')+
      '</div>'+
      '<div class="stat-row">'+
        '<div class="stat-box"><div class="bar"></div><div class="label">Total equity</div><div class="value">'+fmt(totalEq)+'</div><div class="hint">'+accounts.length+' akun</div></div>'+
        '<div class="stat-box"><div class="bar" style="background:linear-gradient(90deg,var(--green),#34d399)"></div><div class="label">Daily profit</div><div class="value '+(totalDaily>=0?'up':'neg')+'">'+fmt(totalDaily)+'</div><div class="hint">Semua akun · hari ini</div></div>'+
        '<div class="stat-box"><div class="bar" style="background:linear-gradient(90deg,#60a5fa,#a78bfa)"></div><div class="label">Total profit</div><div class="value up">'+fmt(totalProfit)+'</div><div class="hint">Kumulatif</div></div>'+
        '<div class="stat-box"><div class="bar" style="background:linear-gradient(90deg,#fbbf24,#f59e0b)"></div><div class="label">Akun online</div><div class="value">'+onlineN+' / '+accounts.length+'</div><div class="hint">Status aktif</div></div>'+
      '</div>'+
      (accounts.length?(
        '<div class="charts-row">'+
          '<div class="chart-card"><h3>Equity per akun</h3><p class="sub">Perbandingan equity live</p><div class="chart-wrap"><canvas id="chart-equity"></canvas></div></div>'+
          '<div class="chart-card"><h3>Komposisi equity</h3><p class="sub">Distribusi antar akun</p><div class="chart-wrap sm"><canvas id="chart-pie"></canvas></div></div>'+
        '</div>'+
        '<div class="chart-card" style="margin-bottom:1.25rem"><h3>Daily profit per akun</h3><p class="sub">Profit / loss hari ini</p><div class="chart-wrap"><canvas id="chart-daily"></canvas></div></div>'
      ):'')+
      '<div class="sec-head"><h2>Detail akun</h2><span class="sub">Balance · equity · profit · ROI</span></div>'+
      '<div class="perf-grid">'+(cards||'<p style="color:var(--text-muted)">Belum ada data akun.</p>')+'</div>'+
      (accounts.length?(
        '<div class="chart-card"><h3>Tabel performa</h3><p class="sub">Ringkasan numerik semua akun</p>'+
          '<div style="overflow-x:auto"><table class="detail-table"><thead><tr>'+
            '<th>Akun</th><th>Status</th><th>Balance</th><th>Equity</th><th>Daily</th><th>Total profit</th><th>Penarikan</th><th>ROI</th>'+
          '</tr></thead><tbody>'+rows+'</tbody></table></div></div>'
      ):'');
    if (accounts.length) setTimeout(function(){ buildCharts(accounts); }, 50);
  }
  load();
  setInterval(load, 45000);
})();
