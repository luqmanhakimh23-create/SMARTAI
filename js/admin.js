/* ==========================================================
   Smart AI Admin — core: tema, util, data layer, UI helper
   Dimuat oleh semua halaman dashboard (setelah icons.js & auth-admin.js)
   ========================================================== */

/* ---------- Helper DOM ---------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function setText(id, value) { var el = document.getElementById(id); if (el) el.textContent = value; }

/* ---------- Tema ---------- */
function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }
function toggleTheme() {
  var next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('smartai_theme', next); } catch (e) {}
  renderThemeButton();
}
function renderThemeButton() {
  var btn = document.getElementById('theme-btn');
  if (btn) btn.innerHTML = icon(currentTheme() === 'dark' ? 'sun' : 'moon');
}

/* ---------- Util ---------- */
function escapeHtml(s) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return map[c]; });
}
function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}
function moneyDec(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function signedMoney(n) { return (n > 0 ? '+' : '') + moneyDec(n); }

/* Avatar inisial dengan warna konsisten per nama */
function avatar(name) {
  var h = 0, s = String(name || '');
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return '<span class="avatar" style="--h:' + h + '">' + escapeHtml(initials(name)) + '</span>';
}

function statusBadge(s) {
  var b = (s === 'Active' || s === 'Online' || s === 'Paid') ? 'ok' : (s === 'Pending' ? 'warn' : 'err');
  return '<span class="badge ' + b + '">' + escapeHtml(s) + '</span>';
}

/* Badge paket: BASIC = hijau, GOLD = emas, PRO = ungu */
function packageBadge(p) {
  var k = String(p || '').toLowerCase();
  var c = k.indexOf('pro') > -1 ? 'pkg-pro' : (k.indexOf('gold') > -1 ? 'pkg-gold' : 'pkg-basic');
  return '<span class="badge plain ' + c + '">' + escapeHtml(p) + '</span>';
}

/* ---------- Data layer (localStorage) ---------- */
var STORE_KEY = 'smartai_admin_data';
var DEFAULT_DATA = {
  members: [
    { id: 1, nama: 'Andi Rahman', email: 'andi@mail.com', hp: '081234567801', paket: 'Smart Gold', status: 'Active', join: '2026-10-01', equity: 102254, referral: 'ANDI-REF' },
    { id: 2, nama: 'Sari Wulandari', email: 'sari@mail.com', hp: '081234567802', paket: 'Smart Basic', status: 'Active', join: '2026-10-12', equity: 76999, referral: 'SARI-REF' },
    { id: 3, nama: 'Budi Pratama', email: 'budi@mail.com', hp: '081234567803', paket: 'Smart Pro', status: 'Active', join: '2026-10-20', equity: 625625, referral: 'BUDI-REF' },
    { id: 4, nama: 'Rina Marlina', email: 'rina@mail.com', hp: '081234567804', paket: 'Smart Basic', status: 'Pending', join: '2026-11-05', equity: 0, referral: '' },
    { id: 5, nama: 'Dedi Kurniawan', email: 'dedi@mail.com', hp: '081234567805', paket: 'Smart Gold', status: 'Inactive', join: '2026-09-08', equity: 28000, referral: '' },
    { id: 6, nama: 'Maya Sari', email: 'maya@mail.com', hp: '081234567806', paket: 'Smart Pro', status: 'Active', join: '2026-09-15', equity: 198450, referral: 'MAYA-REF' },
    { id: 7, nama: 'Fajar Nugroho', email: 'fajar@mail.com', hp: '081234567807', paket: 'Smart Basic', status: 'Active', join: '2026-10-22', equity: 15400, referral: '' },
    { id: 8, nama: 'Lina Kusuma', email: 'lina@mail.com', hp: '081234567808', paket: 'Smart Gold', status: 'Active', join: '2026-11-03', equity: 45200, referral: '' },
    { id: 9, nama: 'Eko Prasetyo', email: 'eko@mail.com', hp: '081234567809', paket: 'Smart Pro', status: 'Pending', join: '2026-11-14', equity: 0, referral: '' },
    { id: 10, nama: 'Nina Safitri', email: 'nina@mail.com', hp: '081234567810', paket: 'Smart Basic', status: 'Active', join: '2026-11-10', equity: 8200, referral: '' }
  ],
  accounts: [
    { id: 'ACC01', owner: 'Sari Wulandari', paket: 'SMART BASIC', deposit: 10000, equity: 76999, daily: 100.8, status: 'Online' },
    { id: 'ACC02', owner: 'Andi Rahman', paket: 'SMART GOLD', deposit: 10000, equity: 102254, daily: 40.3, status: 'Online' },
    { id: 'ACC03', owner: 'Budi Pratama', paket: 'SMART PRO', deposit: 60000, equity: 625625, daily: 1378, status: 'Online' },
    { id: 'ACC04', owner: 'Maya Sari', paket: 'SMART PRO', deposit: 25000, equity: 198450, daily: 312.5, status: 'Online' },
    { id: 'ACC05', owner: 'Dedi Kurniawan', paket: 'SMART GOLD', deposit: 10000, equity: 28000, daily: 0, status: 'Offline' },
    { id: 'ACC06', owner: 'Lina Kusuma', paket: 'SMART GOLD', deposit: 8000, equity: 45200, daily: 55.2, status: 'Online' }
  ],
  commissions: [
    { id: 1, nama: 'Andi Rahman', level: 'L1', amount: 420, status: 'Paid', date: '2026-11-10' },
    { id: 2, nama: 'Maya Sari', level: 'L1', amount: 890, status: 'Paid', date: '2026-11-08' },
    { id: 3, nama: 'Budi Pratama', level: 'L2', amount: 210, status: 'Pending', date: '2026-11-12' },
    { id: 4, nama: 'Sari Wulandari', level: 'L1', amount: 155, status: 'Paid', date: '2026-11-05' },
    { id: 5, nama: 'Fajar Nugroho', level: 'L2', amount: 95, status: 'Pending', date: '2026-11-14' },
    { id: 6, nama: 'Andi Rahman', level: 'L1', amount: 320, status: 'Pending', date: '2026-11-16' }
  ],
  referrals: [
    { code: 'ANDI-REF', owner: 'Andi Rahman', invited: 8, active: 6, commission: 1420 },
    { code: 'MAYA-REF', owner: 'Maya Sari', invited: 12, active: 9, commission: 2180 },
    { code: 'BUDI-REF', owner: 'Budi Pratama', invited: 5, active: 4, commission: 760 },
    { code: 'SARI-REF', owner: 'Sari Wulandari', invited: 3, active: 2, commission: 310 },
    { code: 'SMARTAI-REF', owner: 'System', invited: 24, active: 18, commission: 4520 }
  ],
  activity: [
    { type: 'member', text: 'Member baru: Eko Prasetyo (Pending)', time: '2 jam lalu', level: '' },
    { type: 'commission', text: 'Komisi pending $320 — Andi Rahman', time: '5 jam lalu', level: 'warn' },
    { type: 'account', text: 'ACC05 offline — Dedi Kurniawan', time: '1 hari lalu', level: 'err' },
    { type: 'member', text: 'Nina Safitri diaktifkan', time: '2 hari lalu', level: '' },
    { type: 'payout', text: 'Payout $890 ke Maya Sari', time: '3 hari lalu', level: '' }
  ],
  nextMemberId: 11,
  nextCommId: 7
};

function loadData() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      var d = JSON.parse(raw);
      if (d && d.members) return d;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function saveData(d) { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) {} }
function getData() { return loadData(); }
function updateData(mutator) {
  var d = loadData();
  mutator(d);
  saveData(d);
  return d;
}
function resetData() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  location.reload();
}
function logActivity(type, text, level) {
  updateData(function (d) {
    d.activity = d.activity || [];
    d.activity.unshift({ type: type, text: text, time: 'Baru saja', level: level || '' });
    if (d.activity.length > 40) d.activity.length = 40;
  });
}

/* ---------- Toast ---------- */
function toast(msg, type) {
  var wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  var t = type || 'ok';
  var el = document.createElement('div');
  el.className = 'toast ' + t;
  el.setAttribute('role', 'status');
  el.innerHTML = icon(t === 'err' ? 'alert-circle' : 'check-circle') + '<span>' + escapeHtml(msg) + '</span>';
  wrap.appendChild(el);
  setTimeout(function () {
    el.style.opacity = '0';
    setTimeout(function () { el.remove(); }, 280);
  }, 2800);
}

/* ---------- Modal ---------- */
function openModal(content) {
  closeModal();
  var ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.id = 'modal-ov';
  var box = document.createElement('div');
  box.className = 'modal';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  if (typeof content === 'string') box.innerHTML = content;
  else box.appendChild(content);
  ov.appendChild(box);
  ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(); });
  document.body.appendChild(ov);
  hydrateIcons(ov);
  $$('[data-close]', ov).forEach(function (b) { b.addEventListener('click', closeModal); });
  requestAnimationFrame(function () { ov.classList.add('show'); });
  return box;
}
/* Buka modal dari <template id="..."> di HTML halaman */
function openTemplate(id) {
  var tpl = document.getElementById(id);
  return openModal(tpl.content.cloneNode(true));
}
function closeModal() {
  var ov = document.getElementById('modal-ov');
  if (ov) {
    ov.removeAttribute('id');
    ov.classList.remove('show');
    setTimeout(function () { ov.remove(); }, 200);
  }
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

/* Dialog konfirmasi (pengganti confirm() bawaan browser) */
function confirmDialog(opts, onConfirm) {
  var danger = opts.danger !== false;
  var box = openModal(
    '<div class="modal-body confirm-body">' +
      '<div class="confirm-icon' + (danger ? '' : ' info') + '">' + icon(danger ? 'alert-circle' : 'info') + '</div>' +
      '<h3>' + escapeHtml(opts.title) + '</h3>' +
      '<p>' + escapeHtml(opts.message || '') + '</p>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button type="button" class="btn btn-outline" data-close>Batal</button>' +
      '<button type="button" class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + '" id="confirm-ok">' + escapeHtml(opts.confirmText || 'Ya, lanjutkan') + '</button>' +
    '</div>'
  );
  $('#confirm-ok', box).addEventListener('click', function () { closeModal(); onConfirm(); });
}

/* ---------- Shell (sidebar & topbar) ---------- */
/* Panggil di awal tiap halaman dashboard. Return false jika belum login. */
function initShell() {
  var user = requireAdmin();
  if (!user) return false;

  hydrateIcons();
  renderThemeButton();

  $$('[data-admin-name]').forEach(function (el) { el.textContent = user.nama; });
  $$('[data-admin-email]').forEach(function (el) { el.textContent = user.email; });
  $$('[data-admin-role]').forEach(function (el) { el.textContent = user.role || 'admin'; });
  $$('[data-admin-initials]').forEach(function (el) { el.textContent = initials(user.nama); });

  var pending = (getData().members || []).filter(function (m) { return m.status === 'Pending'; }).length;
  var badge = document.getElementById('nav-pending');
  if (badge && pending) { badge.textContent = pending; badge.hidden = false; }
  var dot = document.getElementById('notif-dot');
  if (dot) dot.hidden = !pending;

  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('backdrop');
  function setSidebar(open) {
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
  }
  document.getElementById('menu-btn').addEventListener('click', function () { setSidebar(!sidebar.classList.contains('open')); });
  backdrop.addEventListener('click', function () { setSidebar(false); });

  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('notif-btn').addEventListener('click', function () {
    toast(pending ? pending + ' member menunggu approval' : 'Tidak ada notifikasi baru', 'ok');
  });
  $$('[data-logout]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); logoutAdmin(); });
  });
  return true;
}

/* ---------- Aksi data ---------- */
function setMemberStatus(id, status) {
  updateData(function (d) {
    var m = d.members.find(function (x) { return x.id === id; });
    if (m) {
      m.status = status;
      logActivity('member', m.nama + ' → ' + status, status === 'Active' ? '' : 'warn');
    }
  });
  toast('Status member diubah: ' + status, 'ok');
}
function addMember(payload) {
  updateData(function (d) {
    var id = d.nextMemberId || (d.members.length + 1);
    d.members.unshift({
      id: id, nama: payload.nama, email: payload.email, hp: payload.hp || '',
      paket: payload.paket || 'Smart Basic', status: payload.status || 'Pending',
      join: new Date().toISOString().slice(0, 10), equity: 0, referral: payload.referral || ''
    });
    d.nextMemberId = id + 1;
    logActivity('member', 'Member baru: ' + payload.nama, 'warn');
  });
  toast('Member ditambahkan', 'ok');
}
function deleteMember(id) {
  updateData(function (d) {
    var m = d.members.find(function (x) { return x.id === id; });
    d.members = d.members.filter(function (x) { return x.id !== id; });
    if (m) logActivity('member', 'Member dihapus: ' + m.nama, 'err');
  });
  toast('Member dihapus', 'ok');
}
function payCommission(id) {
  updateData(function (d) {
    var c = d.commissions.find(function (x) { return x.id === id; });
    if (c && c.status === 'Pending') {
      c.status = 'Paid';
      logActivity('payout', 'Payout $' + c.amount + ' ke ' + c.nama, '');
    }
  });
  toast('Komisi ditandai Paid', 'ok');
}
function unpayCommission(id) {
  updateData(function (d) {
    var c = d.commissions.find(function (x) { return x.id === id; });
    if (c && c.status === 'Paid') {
      c.status = 'Pending';
      logActivity('commission', 'Komisi $' + c.amount + ' ' + c.nama + ' dikembalikan ke Pending', 'warn');
    }
  });
  toast('Komisi ditandai Belum Bayar', 'ok');
}
function payAllPending() {
  var n = 0;
  updateData(function (d) {
    d.commissions.forEach(function (c) { if (c.status === 'Pending') { c.status = 'Paid'; n++; } });
    if (n) logActivity('payout', n + ' komisi dibayar sekaligus', '');
  });
  toast(n ? n + ' komisi dibayar' : 'Tidak ada pending', n ? 'ok' : 'err');
}
function toggleAccountStatus(id) {
  updateData(function (d) {
    var a = d.accounts.find(function (x) { return x.id === id; });
    if (a) {
      a.status = a.status === 'Online' ? 'Offline' : 'Online';
      if (a.status === 'Offline') a.daily = 0;
      logActivity('account', a.id + ' → ' + a.status, a.status === 'Offline' ? 'err' : '');
    }
  });
  toast('Status akun diperbarui', 'ok');
}

/* Ikon aktivitas berdasarkan tipe */
function activityIcon(type) {
  return icon({ account: 'radio', payout: 'dollar', commission: 'wallet', member: 'user' }[type] || 'info');
}
function activityItem(a, withType) {
  return '<li><div class="act-icon ' + (a.level || '') + '">' + activityIcon(a.type) + '</div>' +
    '<div class="act-body"><strong>' + escapeHtml(a.text) + '</strong>' +
    (withType ? '<p>Tipe: ' + escapeHtml(a.type || 'system') + '</p>' : '') + '</div>' +
    '<div class="act-time">' + escapeHtml(a.time) + '</div></li>';
}
