/* Halaman Commissions */
if (initShell()) {
  function render() {
    var rows = getData().commissions || [];
    var sum = function (st) {
      return rows.filter(function (c) { return c.status === st; }).reduce(function (s, c) { return s + c.amount; }, 0);
    };
    var pendingN = rows.filter(function (c) { return c.status === 'Pending'; }).length;

    setText('st-total', rows.length);
    setText('st-paid', money(sum('Paid')));
    setText('st-pending', money(sum('Pending')));
    setText('st-pending-n', pendingN);

    var payAll = document.getElementById('btn-pay-all');
    payAll.hidden = !pendingN;
    payAll.querySelector('span').textContent = 'Bayar semua pending (' + pendingN + ')';

    document.getElementById('tbody').innerHTML = rows.map(function (r) {
      return '<tr data-id="' + r.id + '">' +
        '<td><div class="cell-user">' + avatar(r.nama) + '<b>' + escapeHtml(r.nama) + '</b></div></td>' +
        '<td><span class="badge purple plain">' + escapeHtml(r.level) + '</span></td>' +
        '<td><b>' + money(r.amount) + '</b></td><td>' + statusBadge(r.status) + '</td><td>' + escapeHtml(r.date) + '</td>' +
        '<td><div class="row-actions">' +
          (r.status === 'Pending'
            ? '<button type="button" class="btn btn-success btn-sm" data-act="pay">' + icon('check') + 'Bayar</button>'
            : '<button type="button" class="btn btn-outline btn-sm" data-act="unpay">' + icon('refresh') + 'Belum Bayar</button>') +
        '</div></td></tr>';
    }).join('');
  }

  document.getElementById('btn-pay-all').addEventListener('click', function () {
    confirmDialog({ title: 'Bayar semua komisi pending?', message: 'Semua transaksi berstatus Pending akan ditandai Paid.', confirmText: 'Bayar semua', danger: false },
      function () { payAllPending(); render(); });
  });
  document.getElementById('tbody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var id = Number(btn.closest('tr').getAttribute('data-id'));
    if (btn.getAttribute('data-act') === 'pay') payCommission(id);
    else unpayCommission(id);
    render();
  });

  render();
  hydrateIcons();
}
