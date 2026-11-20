/* Halaman login */
(function () {
  hydrateIcons();

  /* Sudah login? langsung ke dashboard */
  if (getAdmin()) { location.replace('dashboard.html'); return; }

  var form = document.getElementById('form');
  var emailEl = document.getElementById('email');
  var pwEl = document.getElementById('password');
  var btn = document.getElementById('btn');
  var msg = document.getElementById('msg');

  /* Tema */
  var themeBtn = document.getElementById('theme-toggle');
  function paintTheme() {
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    themeBtn.innerHTML = icon(dark ? 'sun' : 'moon');
  }
  paintTheme();
  themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('smartai_theme', next); } catch (e) {}
    paintTheme();
  });

  /* Lihat / sembunyikan sandi */
  var pwBtn = document.getElementById('toggle-pw');
  pwBtn.addEventListener('click', function () {
    var show = pwEl.type === 'password';
    pwEl.type = show ? 'text' : 'password';
    pwBtn.innerHTML = icon(show ? 'eye-off' : 'eye');
    pwBtn.setAttribute('aria-label', show ? 'Sembunyikan sandi' : 'Lihat sandi');
  });

  /* Akun demo: tampilkan di kotak info + tombol isi ulang */
  document.getElementById('demo-email').textContent = DEMO_ADMIN.email;
  document.getElementById('demo-pass').textContent = DEMO_ADMIN.password;
  function fillDemo() {
    emailEl.value = DEMO_ADMIN.email;
    pwEl.value = DEMO_ADMIN.password;
  }
  document.getElementById('demo-fill').addEventListener('click', fillDemo);
  if (!emailEl.value) fillDemo();

  function showMsg(type, iconName, text) {
    msg.className = 'msg ' + type;
    msg.innerHTML = icon(iconName) + '<span>' + text + '</span>';
    msg.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true;
    var session = loginAdmin(emailEl.value, pwEl.value);
    if (session) {
      showMsg('success', 'check-circle', 'Login berhasil. Mengalihkan…');
      setTimeout(function () { location.href = 'dashboard.html'; }, 400);
    } else {
      btn.disabled = false;
      showMsg('error', 'alert-circle', 'Email atau password salah.');
    }
  });
})();
