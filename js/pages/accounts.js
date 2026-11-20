/* Halaman Trading Accounts */
if (initShell()) {
  function render() {
    var accounts = getData().accounts || [];
    var online = accounts.filter(function (a) { return a.status === 'Online'; }).length;
    var totalEq = accounts.reduce(function (s, a) { return s + a.equity; }, 0);
    var totalDaily = accounts.reduce(function (s, a) { return s + a.daily; }, 0);

    setText('st-total', accounts.length);
    setText('st-online', online);
    setText('st-equity', money(totalEq));
    setText('st-daily', signedMoney(totalDaily));

    document.getElementById('tbody').innerHTML = accounts.map(function (a) {
      var isOn = a.status === 'Online';
      return '<tr data-id="' + escapeHtml(a.id) + '">' +
        '<td class="mono"><b>' + escapeHtml(a.id) + '</b></td>' +
        '<td><div class="cell-user">' + avatar(a.owner) + '<b>' + escapeHtml(a.owner) + '</b></div></td>' +
        '<td>' + packageBadge(a.paket) + '</td>' +
        '<td>' + money(a.deposit) + '</td><td>' + money(a.equity) + '</td>' +
        '<td class="' + (a.daily > 0 ? 'up' : 'muted') + '">' + signedMoney(a.daily) + '</td>' +
        '<td>' + statusBadge(a.status) + '</td>' +
        '<td><div class="row-actions"><button type="button" class="btn btn-outline btn-sm" data-act="toggle">' +
          icon('power') + (isOn ? 'Set Offline' : 'Set Online') + '</button></div></td></tr>';
    }).join('');
  }

  document.getElementById('tbody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act=toggle]');
    if (!btn) return;
    toggleAccountStatus(btn.closest('tr').getAttribute('data-id'));
    render();
  });

  render();
  hydrateIcons();
}
