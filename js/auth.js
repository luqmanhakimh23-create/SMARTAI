const AUTH_KEY = 'smartai_user';
const ACCOUNTS_KEY = 'smartai_accounts';

/** Akun demo bawaan */
const DEMO_ACCOUNT = {
  nama: 'Demo Member',
  email: 'demo@smartai.id',
  hp: '081234567890',
  password: 'demo123',
  referral: 'SMARTAI-REF',
  avatar: null
};

function ensureDemoAccount() {
  let accounts = [];
  try {
    accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    if (!Array.isArray(accounts)) accounts = [];
  } catch (e) {
    accounts = [];
  }
  const idx = accounts.findIndex(function (a) {
    return a && a.email && a.email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase();
  });
  const oldIdx = accounts.findIndex(function (a) {
    return a && a.email && a.email.toLowerCase() === 'demo@smartai.com';
  });
  if (oldIdx >= 0 && idx < 0) {
    accounts[oldIdx].email = DEMO_ACCOUNT.email;
    accounts[oldIdx].password = DEMO_ACCOUNT.password;
  } else if (idx < 0) {
    accounts.unshift(Object.assign({}, DEMO_ACCOUNT));
  } else {
    accounts[idx].password = DEMO_ACCOUNT.password;
    if (!accounts[idx].referral) accounts[idx].referral = DEMO_ACCOUNT.referral;
    if (!accounts[idx].nama) accounts[idx].nama = DEMO_ACCOUNT.nama;
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return DEMO_ACCOUNT;
}

function getAccounts() {
  ensureDemoAccount();
  try {
    const list = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    return Array.isArray(list) ? list : [Object.assign({}, DEMO_ACCOUNT)];
  } catch (e) {
    return [Object.assign({}, DEMO_ACCOUNT)];
  }
}

function findAccount(email, password) {
  const accounts = getAccounts();
  return (
    accounts.find(function (a) {
      return (
        a &&
        a.email &&
        a.email.toLowerCase() === String(email).toLowerCase() &&
        a.password === password
      );
    }) || null
  );
}

function findAccountByEmail(email) {
  const accounts = getAccounts();
  const em = String(email || '').toLowerCase();
  return (
    accounts.find(function (a) {
      return a && a.email && a.email.toLowerCase() === em;
    }) || null
  );
}

function sessionFromAccount(found) {
  return {
    nama: found.nama,
    email: found.email,
    hp: found.hp || '',
    referral: found.referral || '',
    avatar: found.avatar || null
  };
}

function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY);
  try {
    localStorage.removeItem('smartai_logged_in');
  } catch (e) {}
}

function requireAuth() {
  const user = getUser();
  if (!user) {
    location.href = (location.pathname.includes('/member/') ? '../login.html' : 'login.html');
    return null;
  }
  return user;
}

function redirectIfLoggedIn() {
  if (getUser()) location.href = (location.pathname.includes('/member/') ? 'dashboard.html' : 'member/dashboard.html');
}

function logout() {
  clearUser();
  location.href = (location.pathname.includes('/member/') ? '../login.html' : 'login.html');
}

function initials(name) {
  if (!name) return 'U';
  return String(name)
    .split(/\s+/)
    .map(function (p) {
      return p[0] || '';
    })
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function setupPasswordToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', function () {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
  });
}

/** Login helper */
function loginWithCredentials(email, password) {
  ensureDemoAccount();
  const found = findAccount(email, password);
  if (!found) return null;
  const session = sessionFromAccount(found);
  setUser(session);
  return session;
}

/**
 * Register new account into localStorage.
 * @returns {{ ok: true, user } | { ok: false, error: string }}
 */
function registerAccount(data) {
  ensureDemoAccount();
  const nama = String(data.nama || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const hp = String(data.hp || '').trim();
  const password = String(data.password || '');
  const referral = String(data.referral || '').trim();

  if (!nama) return { ok: false, error: 'Nama wajib diisi.' };
  if (!email || email.indexOf('@') < 1) return { ok: false, error: 'Email tidak valid.' };
  if (!hp || hp.length < 8) return { ok: false, error: 'Nomor HP tidak valid.' };
  if (!password || password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };

  if (findAccountByEmail(email)) {
    return { ok: false, error: 'Email sudah terdaftar. Silakan login.' };
  }

  const accounts = getAccounts();
  const account = {
    nama: nama,
    email: email,
    hp: hp,
    password: password,
    referral: referral || '',
    avatar: null,
    createdAt: new Date().toISOString()
  };
  accounts.push(account);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

  const session = sessionFromAccount(account);
  setUser(session);
  return { ok: true, user: session };
}

ensureDemoAccount();
