if (renderShell('transactions')) {
  var root = document.getElementById('page-content');
  root.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted)">Memuat transaksi…</div>';

  async function loadTx() {
    var accounts = [];
    try { accounts = await SmartAIMT5.getAccounts(true); } catch (e) {}
    accounts.sort(function(a,b){ return String(a.account_id).localeCompare(String(b.account_id)); });
    var live = SmartAIMT5.isLive && SmartAIMT5.isLive();
    var totalDep = 0, totalWd = 0;
    accounts.forEach(function(a) {
      if (Number.isFinite(Number(a.deposit_awal))) totalDep += Number(a.deposit_awal);
      if (Number.isFinite(Number(a.total_penarikan))) totalWd += Number(a.total_penarikan);
    });

    var rows = accounts.map(function(a) {
      return '<tr>' +
        '<td>' + SmartAIMT5.escape(a.account_id) + '</td>' +
        '<td>' + SmartAIMT5.escape(a.name || a.account_id) + '</td>' +
        '<td>' + SmartAIMT5.formatUSD(a.deposit_awal) + '</td>' +
        '<td>' + SmartAIMT5.formatUSD(a.total_penarikan) + '</td>' +
        '<td>' + SmartAIMT5.formatUSD(a.balance) + '</td>' +
        '<td>' + SmartAIMT5.formatUSD(a.equity) + '</td>' +
        '<td><span class="badge ' + (String(a.status).toUpperCase()==='ONLINE'?'ok':'info') + '">' + SmartAIMT5.escape(a.status||'\u2014') + '</span></td>' +
      '</tr>';
    }).join('');

    var timeline = accounts.map(function(a, idx) {
      return '<tr>' +
        '<td>#WD-' + (1000 + idx) + '</td>' +
        '<td>' + SmartAIMT5.escape(a.account_id) + '</td>' +
        '<td>Total penarikan (EA)</td>' +
        '<td>' + SmartAIMT5.formatUSD(a.total_penarikan) + '</td>' +
        '<td><span class="badge ok">Recorded</span></td>' +
      '</tr>';
    }).join('');

    root.innerHTML =
      '<div class="page-header"><div><h1>Transactions</h1><p>' +
        (live
          ? 'Deposit awal & total penarikan dari data live akun MT5.'
          : 'Mode demo · angka contoh dari struktur akun MT5.') +
      '</p></div></div>' +
      '<div class="stats-grid">' +
        '<div class="stat-card"><div class="label">Total deposit awal</div><div class="value up">' + SmartAIMT5.formatUSD(totalDep) + '</div></div>' +
        '<div class="stat-card"><div class="label">Total penarikan</div><div class="value">' + SmartAIMT5.formatUSD(totalWd) + '</div></div>' +
        '<div class="stat-card"><div class="label">Akun MT5</div><div class="value">' + accounts.length + '</div></div>' +
        '<div class="stat-card"><div class="label">Sumber</div><div class="value" style="font-size:1rem">' + (live?'LIVE':'DEMO') + '</div></div>' +
      '</div>' +
      '<div class="panel">' +
        '<div class="panel-head"><h2>Per akun</h2><span class="sub">deposit_awal · total_penarikan · balance</span></div>' +
        '<div class="table-wrap"><table>' +
          '<thead><tr><th>Akun</th><th>Nama</th><th>Deposit awal</th><th>Total penarikan</th><th>Balance</th><th>Equity</th><th>Status</th></tr></thead>' +
          '<tbody>' + (rows || '<tr><td colspan="7">Tidak ada data</td></tr>') + '</tbody>' +
        '</table></div>' +
      '</div>' +
      '<div class="panel" style="margin-top:1.25rem">' +
        '<div class="panel-head"><h2>Ringkasan penarikan</h2><span class="sub">Nilai kumulatif dari payload EA</span></div>' +
        '<div class="table-wrap"><table>' +
          '<thead><tr><th>ID</th><th>Akun</th><th>Keterangan</th><th>Jumlah</th><th>Status</th></tr></thead>' +
          '<tbody>' + timeline + '</tbody>' +
        '</table></div>' +
      '</div>';
  }
  loadTx();
  setInterval(loadTx, 45000);
}
