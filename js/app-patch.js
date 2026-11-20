/* Smart AI runtime patches — load after app.js */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href === 'performance.html' || /\/performance\.html$/.test(href)) {
      e.preventDefault();
      location.href = href.replace('performance.html', 'ea-performance.html');
    }
    if (href === 'register.html' || /\/member\/register\.html/.test(href)) {
      e.preventDefault();
      location.href = '../daftar.html' + (location.search || '');
    }
  }, true);

  function fixReferralLink() {
    var el = document.getElementById('ref-link');
    if (!el) return;
    var t = el.textContent || '';
    if (/register\.html/.test(t)) {
      el.textContent = t.replace(/\/member\/register\.html/g, '/daftar.html').replace(/register\.html/g, 'daftar.html');
    }
  }
  function clampDashboardDaily() {
    document.querySelectorAll('.stat-card.dash-stat .value, .mt5-mini .dp').forEach(function (node) {
      var raw = (node.textContent || '').replace(/[^0-9.,-]/g, '');
      var n = parseFloat(raw.replace(/,/g, ''));
      if (Number.isFinite(n) && Math.abs(n) > 500000) node.textContent = '$0.00';
    });
  }
  function boot() {
    setTimeout(fixReferralLink, 500);
    setTimeout(fixReferralLink, 2000);
    setTimeout(clampDashboardDaily, 1500);
    setTimeout(clampDashboardDaily, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
