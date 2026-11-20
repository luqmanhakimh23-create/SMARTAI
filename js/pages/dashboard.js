/* Halaman Dashboard */
if (initShell()) {
  var d = getData();
  var members = d.members || [];
  var accounts = d.accounts || [];
  var commissions = d.commissions || [];
  var activity = d.activity || [];

  var active = members.filter(function (m) { return m.status === 'Active'; }).length;
  var pending = members.filter(function (m) { return m.status === 'Pending'; }).length;
  var totalEq = accounts.reduce(function (s, a) { return s + a.equity; }, 0);
  var online = accounts.filter(function (a) { return a.status === 'Online'; }).length;
  var sumBy = function (st) {
    return commissions.filter(function (c) { return c.status === st; }).reduce(function (s, c) { return s + c.amount; }, 0);
  };

  /* Kartu statistik */
  setText('st-members', members.length);
  setText('st-members-hint', active + ' active · ' + pending + ' pending');
  setText('st-accounts', accounts.length);
  setText('st-accounts-hint', online + ' online sekarang');
  setText('st-equity', money(totalEq));
  setText('st-comm', money(sumBy('Pending')));
  setText('st-comm-hint', 'Paid: ' + money(sumBy('Paid')));

  /* Tombol review pending */
  if (pending) {
    var rv = document.getElementById('review-pending');
    rv.querySelector('span').textContent = 'Review ' + pending + ' pending';
    rv.hidden = false;
  }

  /* Bar chart mingguan */
  var weekBars = [42, 58, 35, 72, 65, 88, 54];
  var days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  var maxBar = Math.max.apply(null, weekBars);
  document.getElementById('bar-chart').innerHTML = weekBars.map(function (v, i) {
    return '<div class="bar-col"><div class="bar" style="height:' + Math.round(v / maxBar * 100) + '%"><span>' + v + '</span></div><small>' + days[i] + '</small></div>';
  }).join('');

  /* Aktivitas terbaru */
  document.getElementById('activity-list').innerHTML = activity.slice(0, 5).map(function (a) {
    return activityItem(a, false);
  }).join('');

  /* Member terbaru */
  document.getElementById('members-body').innerHTML = members.slice(0, 6).map(function (m) {
    return '<tr><td><div class="cell-user">' + avatar(m.nama) + '<div><b>' + escapeHtml(m.nama) + '</b><small>' + escapeHtml(m.email) + '</small></div></div></td>' +
      '<td>' + packageBadge(m.paket) + '</td><td>' + statusBadge(m.status) + '</td></tr>';
  }).join('');

  /* Akun trading */
  document.getElementById('accounts-body').innerHTML = accounts.map(function (a) {
    return '<tr><td class="mono"><b>' + escapeHtml(a.id) + '</b></td><td>' + money(a.equity) + '</td>' +
      '<td class="' + (a.daily > 0 ? 'up' : 'muted') + '">' + signedMoney(a.daily) + '</td><td>' + statusBadge(a.status) + '</td></tr>';
  }).join('');

  hydrateIcons();
}
