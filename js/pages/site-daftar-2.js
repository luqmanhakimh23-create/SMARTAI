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
    try {
      var params = new URLSearchParams(location.search);
      var ref = params.get('ref');
      if (ref) document.getElementById('ref').value = ref;
    } catch (e) {}
    var form = document.getElementById('signup-form');
    var msg = document.getElementById('msg');
    var btn = document.getElementById('btn-submit');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nama = (document.getElementById('nama').value || '').trim();
      var email = (document.getElementById('email').value || '').trim();
      var hp = (document.getElementById('hp').value || '').trim();
      var pass = document.getElementById('password').value || '';
      var pass2 = document.getElementById('password2').value || '';
      var referral = (document.getElementById('ref').value || '').trim() || 'SMARTAI-REF';
      if (!nama || !email || !hp || pass.length < 6) {
        msg.className = 'msg show error';
        msg.textContent = 'Lengkapi semua data. Password minimal 6 karakter.';
        return;
      }
      if (pass !== pass2) {
        msg.className = 'msg show error';
        msg.textContent = 'Password tidak sama.';
        return;
      }
      btn.disabled = true;
      var session = { nama: nama, email: email, hp: hp, referral: referral.toUpperCase(), avatar: null };
      try {
        localStorage.setItem('smartai_user', JSON.stringify(session));
        if (typeof registerUser === 'function') registerUser(session, pass);
      } catch (err) {}
      msg.className = 'msg show success';
      msg.textContent = 'Pendaftaran berhasil. Mengalihkan ke dashboard...';
      setTimeout(function () { location.href = 'member/dashboard.html'; }, 600);
    });
  })();
  
