/* Login form handler (demo localStorage) */
(function () {
  var form = document.getElementById('login-form');
  var msg = document.getElementById('login-msg');
  if (!form) return;

  // Demo credentials
  var DEMO_USER = 'demo@smartai.id';
  var DEMO_PASS = 'demo123';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var user = (form.user.value || '').trim().toLowerCase();
    var pass = form.pass.value || '';

    if (user === DEMO_USER && pass === DEMO_PASS) {
      try {
        localStorage.setItem('smartai_logged_in', '1');
        localStorage.setItem('smartai_user', user);
      } catch (err) {}
      if (msg) {
        msg.className = 'msg success';
        msg.style.display = 'block';
        msg.textContent = 'Login berhasil. Mengalihkan ke dashboard...';
      }
      setTimeout(function () {
        window.location.href = (location.pathname.includes('/member/') ? 'dashboard.html' : 'member/dashboard.html');
      }, 800);
    } else {
      if (msg) {
        msg.className = 'msg error';
        msg.style.display = 'block';
        msg.textContent = 'Email atau password salah. Coba demo@smartai.id / demo123';
      }
    }
  });
})();
