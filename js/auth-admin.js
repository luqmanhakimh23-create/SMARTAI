/* Smart AI Admin — autentikasi demo (localStorage) */
var ADMIN_KEY = 'smartai_admin';

/* Akun demo — ubah di sini kalau mau ganti email/sandi */
var DEMO_ADMIN = {
  nama: 'Super Admin',
  email: 'admin@smartai.id',
  password: 'admin123',
  role: 'superadmin'
};

function getAdmin() {
  try {
    var raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function setAdmin(user) { localStorage.setItem(ADMIN_KEY, JSON.stringify(user)); }
function clearAdmin() { localStorage.removeItem(ADMIN_KEY); }

function requireAdmin() {
  var user = getAdmin();
  if (!user) { location.replace('index.html'); return null; }
  return user;
}

function loginAdmin(email, password) {
  var em = String(email || '').trim().toLowerCase();
  var pw = String(password || '');
  if ((em === DEMO_ADMIN.email || em === 'admin') && pw === DEMO_ADMIN.password) {
    var session = { nama: DEMO_ADMIN.nama, email: DEMO_ADMIN.email, role: DEMO_ADMIN.role };
    setAdmin(session);
    return session;
  }
  return null;
}

function logoutAdmin() {
  clearAdmin();
  location.href = 'index.html';
}

function initials(name) {
  if (!name) return 'A';
  return String(name).split(/\s+/).map(function (p) { return p[0] || ''; }).slice(0, 2).join('').toUpperCase();
}
