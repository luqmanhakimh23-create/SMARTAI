if (renderShell('clients')) {
  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div>
        <h1>My Clients</h1>
        <p>Daftar klien yang terhubung dengan akun Anda.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="label">Total Clients</div><div class="value">12</div></div>
      <div class="stat-card"><div class="label">Active</div><div class="value up">9</div></div>
      <div class="stat-card"><div class="label">Inactive</div><div class="value">2</div></div>
      <div class="stat-card"><div class="label">Pending</div><div class="value">1</div></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Daftar klien</h2><span class="sub">Data demo</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Paket</th><th>Join</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Andi R.</td><td>Smart Gold</td><td>01 Oct 2026</td><td><span class="badge ok">Active</span></td></tr>
            <tr><td>Sari W.</td><td>Smart Basic</td><td>12 Oct 2026</td><td><span class="badge ok">Active</span></td></tr>
            <tr><td>Budi P.</td><td>Smart Pro</td><td>20 Oct 2026</td><td><span class="badge ok">Active</span></td></tr>
            <tr><td>Rina M.</td><td>Smart Basic</td><td>05 Nov 2026</td><td><span class="badge warn">Pending</span></td></tr>
            <tr><td>Dedi K.</td><td>Smart Gold</td><td>08 Sep 2026</td><td><span class="badge err">Inactive</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}
