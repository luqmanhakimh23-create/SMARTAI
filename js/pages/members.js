/* Halaman Members */
if (initShell()) {
  function render() {
    var all = getData().members || [];
    setText('st-total', all.length);
    setText('st-active', all.filter(function (m) { return m.status === 'Active'; }).length);
    setText('st-pending', all.filter(function (m) { return m.status === 'Pending'; }).length);
    setText('st-inactive', all.filter(function (m) { return m.status === 'Inactive'; }).length);

    var q = (document.getElementById('q').value || '').toLowerCase();
    var st = document.getElementById('f-status').value;
    var pk = document.getElementById('f-paket').value;

    var list = all.filter(function (m) {
      if (st && m.status !== st) return false;
      if (pk && m.paket !== pk) return false;
      if (q && (m.nama + ' ' + m.email + ' ' + (m.hp || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    setText('count', list.length + ' member');

    var tbody = document.getElementById('tbody');
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">' + icon('users') + 'Tidak ada member ditemukan</div></td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (m) {
      var acts = '';
      if (m.status === 'Pending') acts += '<button type="button" class="btn btn-success btn-sm" data-act="approve">' + icon('check') + 'Approve</button>';
      if (m.status === 'Active') acts += '<button type="button" class="btn btn-outline btn-sm" data-act="inactive">' + icon('power') + 'Nonaktif</button>';
      if (m.status === 'Inactive') acts += '<button type="button" class="btn btn-success btn-sm" data-act="activate">' + icon('power') + 'Aktifkan</button>';
      acts += '<button type="button" class="btn-icon" data-act="detail" title="Detail" aria-label="Detail">' + icon('eye') + '</button>';
      acts += '<button type="button" class="btn-icon danger" data-act="delete" title="Hapus" aria-label="Hapus">' + icon('trash') + '</button>';
      return '<tr data-id="' + m.id + '">' +
        '<td><div class="cell-user">' + avatar(m.nama) + '<div><b>' + escapeHtml(m.nama) + '</b><small>' + escapeHtml(m.email) + '</small></div></div></td>' +
        '<td>' + packageBadge(m.paket) + '</td><td>' + escapeHtml(m.join) + '</td><td>' + money(m.equity) + '</td>' +
        '<td>' + statusBadge(m.status) + '</td><td><div class="row-actions">' + acts + '</div></td></tr>';
    }).join('');
  }

  /* Delegasi klik tombol aksi di tabel */
  document.getElementById('tbody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var id = Number(btn.closest('tr').getAttribute('data-id'));
    var act = btn.getAttribute('data-act');
    var m = getData().members.find(function (x) { return x.id === id; });
    if (!m) return;

    if (act === 'approve' || act === 'activate') { setMemberStatus(id, 'Active'); render(); }
    else if (act === 'inactive') { setMemberStatus(id, 'Inactive'); render(); }
    else if (act === 'delete') {
      confirmDialog({ title: 'Hapus member?', message: m.nama + ' akan dihapus permanen dari daftar.', confirmText: 'Hapus' },
        function () { deleteMember(id); render(); });
    } else if (act === 'detail') {
      var box = openTemplate('tpl-detail');
      var set = function (f, v) { $('[data-f="' + f + '"]', box).textContent = v; };
      set('nama', m.nama); set('email', m.email); set('hp', m.hp || '—');
      $('[data-f="paket"]', box).innerHTML = packageBadge(m.paket); set('join', m.join); set('equity', money(m.equity));
      $('[data-f="status"]', box).innerHTML = statusBadge(m.status);
    }
  });

  document.getElementById('q').addEventListener('input', render);
  document.getElementById('f-status').addEventListener('change', render);
  document.getElementById('f-paket').addEventListener('change', render);

  /* Tambah member */
  document.getElementById('btn-add').addEventListener('click', function () {
    var box = openTemplate('tpl-add');
    $('#f-nama', box).focus();
    $('#m-save', box).addEventListener('click', function () {
      var nama = $('#f-nama', box).value.trim();
      var email = $('#f-email', box).value.trim();
      if (!nama || !email) { toast('Nama & email wajib diisi', 'err'); return; }
      addMember({
        nama: nama, email: email,
        hp: $('#f-hp', box).value.trim(),
        paket: $('#f-paket-add', box).value,
        status: $('#f-status-add', box).value
      });
      closeModal();
      render();
    });
  });

  render();
  hydrateIcons();
}
