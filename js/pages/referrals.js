/* Halaman Referrals */
if (initShell()) {
  var rows = getData().referrals || [];
  var total = function (k) { return rows.reduce(function (s, r) { return s + r[k]; }, 0); };

  setText('st-codes', rows.length);
  setText('st-invited', total('invited'));
  setText('st-active', total('active'));
  setText('st-comm', money(total('commission')));

  document.getElementById('tbody').innerHTML = rows.map(function (r) {
    return '<tr><td><span class="badge info plain mono">' + escapeHtml(r.code) + '</span></td>' +
      '<td><div class="cell-user">' + avatar(r.owner) + '<b>' + escapeHtml(r.owner) + '</b></div></td>' +
      '<td>' + r.invited + '</td><td>' + r.active + '</td><td>' + money(r.commission) + '</td>' +
      '<td><div class="row-actions"><button type="button" class="btn btn-outline btn-sm" data-copy="' + escapeHtml(r.code) + '">' + icon('copy') + 'Salin</button></div></td></tr>';
  }).join('');

  document.getElementById('tbody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var code = btn.getAttribute('data-copy');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(function () { toast('Kode disalin: ' + code, 'ok'); });
    } else {
      toast(code, 'ok');
    }
  });
  hydrateIcons();
}
