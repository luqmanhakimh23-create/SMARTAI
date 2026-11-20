/* Halaman Activity Log */
if (initShell()) {
  var activity = getData().activity || [];
  setText('count', activity.length + ' entri');
  document.getElementById('log').innerHTML = activity.length
    ? '<ul class="activity-list">' + activity.map(function (a) { return activityItem(a, true); }).join('') + '</ul>'
    : '<div class="empty-state">' + icon('inbox') + 'Belum ada aktivitas</div>';
  hydrateIcons();
}
