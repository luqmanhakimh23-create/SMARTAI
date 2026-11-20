  (function () {
    var html = document.documentElement;
    var themeBtn = document.getElementById('theme-toggle');
    try {
      var saved = localStorage.getItem('smartai_theme') || localStorage.getItem('theme');
      if (saved) html.setAttribute('data-theme', saved);
    } catch (e) {}
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        try { localStorage.setItem('smartai_theme', next); localStorage.setItem('theme', next); } catch (e) {}
      });
    }
    var form = document.getElementById('login-form');
    var emailEl = document.getElementById('email');
    var passEl = document.getElementById('password');
    var msg = document.getElementById('msg');
    var btnDemo = document.getElementById('btn-demo');
    var btnSubmit = document.getElementById('btn-submit');
    if (btnDemo) {
      btnDemo.addEventListener('click', function () {
        emailEl.value = 'demo@smartai.id';
        passEl.value = 'demo123';
        btnDemo.textContent = 'Terisi \u2713';
        setTimeout(function () { btnDemo.textContent = 'Isi akun demo'; }, 1200);
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (emailEl.value || '').trim();
      var pass = passEl.value || '';
      btnSubmit.disabled = true;
      var session = null;
      if (typeof loginWithCredentials === 'function') session = loginWithCredentials(email, pass);
      if (!session) {
        var em = email.toLowerCase();
        if ((em === 'demo@smartai.id' || em === 'demo@smartai.com') && pass === 'demo123') {
          session = { nama: 'Demo Member', email: 'demo@smartai.id', hp: '081234567890', referral: 'SMARTAI-REF', avatar: null };
          try { localStorage.setItem('smartai_user', JSON.stringify(session)); } catch (err) {}
        }
      }
      if (session) {
        msg.className = 'msg show success';
        msg.textContent = 'Login berhasil. Mengalihkan...';
        setTimeout(function () { location.href = 'member/dashboard.html'; }, 400);
      } else {
        btnSubmit.disabled = false;
        msg.className = 'msg show error';
        msg.textContent = 'Email atau password salah. Klik "Isi akun demo".';
      }
    });
  })();
  
