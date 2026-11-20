if (renderShell('trading')) {
  var root = document.getElementById('page-content');
  root.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted)">Memuat trading report…</div>';

  var trades = [
    { date:'16 Nov 2026', time:'14:22', acc:'ACC01', pair:'XAUUSD', type:'Buy', lot:0.10, entry:2648.20, exit:2652.45, pnl:42.50, status:'Closed' },
    { date:'16 Nov 2026', time:'11:05', acc:'ACC03', pair:'XAUUSD', type:'Sell', lot:0.20, entry:2655.10, exit:2651.80, pnl:66.00, status:'Closed' },
    { date:'16 Nov 2026', time:'09:40', acc:'ACC02', pair:'XAUUSD', type:'Sell', lot:0.05, entry:2650.00, exit:2652.42, pnl:-12.10, status:'Closed' },
    { date:'15 Nov 2026', time:'16:18', acc:'ACC01', pair:'EURUSD', type:'Buy', lot:0.20, entry:1.0824, exit:1.0838, pnl:28.00, status:'Closed' },
    { date:'15 Nov 2026', time:'10:02', acc:'ACC03', pair:'XAUUSD', type:'Buy', lot:0.15, entry:2639.50, exit:2645.80, pnl:94.50, status:'Closed' },
    { date:'14 Nov 2026', time:'13:55', acc:'ACC02', pair:'XAUUSD', type:'Buy', lot:0.15, entry:2632.10, exit:2636.45, pnl:65.20, status:'Closed' },
    { date:'14 Nov 2026', time:'08:30', acc:'ACC01', pair:'GBPUSD', type:'Sell', lot:0.10, entry:1.2680, exit:1.2692, pnl:-12.00, status:'Closed' },
    { date:'13 Nov 2026', time:'15:44', acc:'ACC03', pair:'XAUUSD', type:'Buy', lot:0.25, entry:2620.40, exit:2628.90, pnl:212.50, status:'Closed' },
    { date:'13 Nov 2026', time:'11:12', acc:'ACC02', pair:'GBPUSD', type:'Sell', lot:0.10, entry:1.2710, exit:1.2718, pnl:-8.40, status:'Closed' },
    { date:'12 Nov 2026', time:'14:08', acc:'ACC01', pair:'XAUUSD', type:'Buy', lot:0.10, entry:2615.00, exit:2621.30, pnl:63.00, status:'Closed' }
  ];

  function rows(list) {
    return list.map(function(t) {
      var pnlCls = t.pnl >= 0 ? 'pnl-up' : 'pnl-down';
      var pnlStr = (t.pnl >= 0 ? '+$' : '-$') + Math.abs(t.pnl).toFixed(2);
      var typeCls = t.type === 'Buy' ? 'buy' : 'sell';
      return '<tr data-acc="'+t.acc+'">' +
        '<td>'+t.date+'<div style="font-size:.7rem;color:var(--text-dim)">'+t.time+'</div></td>' +
        '<td><span style="font-size:.72rem;font-weight:600;color:var(--text-muted)">'+t.acc+'</span></td>' +
        '<td class="pair-cell">'+t.pair+'</td>' +
        '<td><span class="trade-badge '+typeCls+'">'+t.type+'</span></td>' +
        '<td>'+t.lot.toFixed(2)+'</td>' +
        '<td style="font-size:.82rem;color:var(--text-muted)">'+t.entry+' → '+t.exit+'</td>' +
        '<td class="'+pnlCls+'">'+pnlStr+'</td>' +
        '<td style="font-size:.75rem;color:var(--text-dim)">'+t.status+'</td>' +
      '</tr>';
    }).join('');
  }

  async function loadReport() {
    var accounts = [];
    try { accounts = await SmartAIMT5.getAccounts(true); } catch (e) {}
    accounts.sort(function(a,b){ return String(a.account_id).localeCompare(String(b.account_id)); });
    var live = SmartAIMT5.isLive && SmartAIMT5.isLive();
    var totalDaily = 0, totalProfit = 0;
    accounts.forEach(function(a) {
      if (Number.isFinite(Number(a.daily_profit))) totalDaily += Number(a.daily_profit);
      if (Number.isFinite(Number(a.total_profit))) totalProfit += Number(a.total_profit);
    });
    var totalPnl = trades.reduce(function(s,t){ return s + t.pnl; }, 0);
    var wins = trades.filter(function(t){ return t.pnl > 0; }).length;
    var winRate = ((wins / trades.length) * 100).toFixed(1);
    var lots = trades.reduce(function(s,t){ return s + t.lot; }, 0);

    var liveBar = accounts.map(function(a) {
      return '<div class="acc-live"><div class="t">' + SmartAIMT5.escape(a.account_id) + ' · ' + SmartAIMT5.escape(a.status||'') +
        '</div><div class="v">' + SmartAIMT5.formatUSD(a.daily_profit) + '</div>' +
        '<div style="font-size:.72rem;color:var(--text-muted)">Daily · Equity ' + SmartAIMT5.formatUSD(a.equity) + '</div></div>';
    }).join('');

    root.innerHTML =
      '<div class="page-header"><div><h1>Trading Report</h1><p>' +
        (live ? 'Ringkasan live dari API MT5 + log trade ilustratif.' : 'Mode demo · data ilustratif.') +
      '</p></div></div>' +
      '<div class="stats-grid">' +
        '<div class="stat-card"><div class="label">Daily profit (live)</div><div class="value '+(totalDaily>=0?'up':'')+'">' + SmartAIMT5.formatUSD(totalDaily) + '</div></div>' +
        '<div class="stat-card"><div class="label">Total profit (live)</div><div class="value up">' + SmartAIMT5.formatUSD(totalProfit) + '</div></div>' +
        '<div class="stat-card"><div class="label">Sample win rate</div><div class="value">'+winRate+'%</div></div>' +
        '<div class="stat-card"><div class="label">Sample volume</div><div class="value">'+lots.toFixed(2)+' lot</div></div>' +
      '</div>' +
      '<div class="acc-live-bar">' + liveBar + '</div>' +
      '<div class="panel">' +
        '<div class="panel-head"><h2>Trade log</h2><span class="sub">Ilustratif · bukan ticket broker real-time</span></div>' +
        '<div class="tr-filters">' +
          '<button type="button" class="acc-pill active" data-filter="all">Semua akun</button>' +
          accounts.map(function(a){ return '<button type="button" class="acc-pill" data-filter="'+a.account_id+'">'+a.account_id+'</button>'; }).join('') +
        '</div>' +
        '<div class="table-wrap"><table id="trade-table">' +
          '<thead><tr><th>Waktu</th><th>Akun</th><th>Pair</th><th>Type</th><th>Lot</th><th>Entry → Exit</th><th>P/L</th><th>Status</th></tr></thead>' +
          '<tbody>'+rows(trades)+'</tbody></table></div>' +
        '<div class="summary-row">' +
          '<span>Sample P/L: <strong>'+(totalPnl>=0?'+$':'-$')+Math.abs(totalPnl).toFixed(2)+'</strong></span>' +
          '<span>Live daily (all): <strong>' + SmartAIMT5.formatUSD(totalDaily) + '</strong></span>' +
        '</div>' +
      '</div>';

    document.querySelectorAll('.acc-pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.acc-pill').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        document.querySelectorAll('#trade-table tbody tr').forEach(function(tr) {
          tr.style.display = (f === 'all' || tr.getAttribute('data-acc') === f) ? '' : 'none';
        });
      });
    });
  }
  loadReport();
  setInterval(loadReport, 45000);
}
