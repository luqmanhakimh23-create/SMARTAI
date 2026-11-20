const user = renderShell('commission');
if (user) {
  var root = document.getElementById('page-content');
  root.innerHTML = '<div class="page-loading"><div class="spin"></div><p>Memuat data komisi…</p></div>';
  setTimeout(function() {
    root.innerHTML =
      '<div class="page-header"><div><h1>Commission</h1><p>Ringkasan komisi referral kamu</p></div></div>' +
      '<div class="stat-row">' +
        '<div class="stat-box"><div class="label">Total Komisi</div><div class="value up">$411.00</div></div>' +
        '<div class="stat-box"><div class="label">Bulan Ini</div><div class="value up">$411.00</div></div>' +
        '<div class="stat-box"><div class="label">Downline</div><div class="value">10</div></div>' +
      '</div>' +
      '<div class="comm-grid">' +
        '<div class="chart-card"><h3>Komisi per Level</h3><p class="sub">Struktur multi-level Smart AI</p>' +
          '<ul class="level-list">' +
            '<li><span class="lv">Level 1</span><span>$375.00</span></li>' +
            '<li><span class="lv">Level 2</span><span>$36.00</span></li>' +
            '<li><span class="lv">Level 3</span><span>$0.00</span></li>' +
            '<li><span class="lv">Level 4+</span><span>$0.00</span></li>' +
          '</ul></div>' +
        '<div class="chart-card"><h3>Cara Kerja</h3><p class="sub">Komisi dihitung dari volume trading downline sesuai aturan package.</p>' +
          '<p style="font-size:.85rem;color:var(--text-muted);line-height:1.6">Pastikan kode referral kamu dibagikan. Downline yang daftar dengan kode kamu akan muncul di halaman Referral & Clients.</p>' +
          '<a href="referral.html" class="btn-primary" style="display:inline-flex;margin-top:1rem;width:auto;padding:.65rem 1.2rem;text-decoration:none">Lihat Network →</a>' +
        '</div></div>';
  }, 400);
}
