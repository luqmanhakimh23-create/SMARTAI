if (renderShell('support')) {
  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div>
        <h1>Support</h1>
        <p>Bantuan teknis, akun, dan operasional Smart AI.</p>
      </div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h2>Hubungi support</h2></div>
        <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.25rem;line-height:1.6">
          Tim Smart AI siap membantu setup EA, verifikasi akun, withdraw, dan pertanyaan teknis.
        </p>
        <a class="btn-primary" style="display:inline-flex;align-items:center;justify-content:center;width:auto;padding:.75rem 1.5rem;text-decoration:none" href="https://wa.me/6282137585596" target="_blank" rel="noopener">Chat WhatsApp</a>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Jam operasional</h2></div>
        <div class="table-wrap">
          <table>
            <tbody>
              <tr><td>Senin – Jumat</td><td>09:00 – 18:00 WIB</td></tr>
              <tr><td>Sabtu</td><td>09:00 – 14:00 WIB</td></tr>
              <tr><td>Minggu</td><td>Tutup</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Tiket terakhir</h2><span class="sub">Data demo</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Subjek</th><th>Tanggal</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>#SUP-88</td><td>Setup EA MT5</td><td>12 Nov 2026</td><td><span class="badge ok">Resolved</span></td></tr>
            <tr><td>#SUP-91</td><td>Verifikasi withdraw</td><td>14 Nov 2026</td><td><span class="badge warn">Open</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}
