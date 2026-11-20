(function () {
  var user = renderShell('profile');
  if (!user) return;

  var pendingAvatar = user.avatar || null;
  var content = document.getElementById('page-content');

  content.innerHTML =
    '<div class="panel" style="max-width:560px">' +
      '<div class="panel-head"><h2>Profil member</h2><span class="sub">Edit data & foto</span></div>' +
      '<div class="avatar-edit">' +
        '<div class="avatar-preview" id="avatar-preview"></div>' +
        '<div class="avatar-actions">' +
          '<label class="btn-file">📷 Ganti foto profil<input type="file" id="avatar-input" accept="image/*"/></label>' +
          '<button type="button" class="btn-remove" id="avatar-remove">Hapus foto</button>' +
          '<p class="hint">Pilih foto dari galeri/HP. Format gambar apa saja. Otomatis dikompres.</p>' +
        '</div>' +
      '</div>' +
      '<div class="form-group"><label>Nama lengkap</label><input type="text" id="p-nama" value="' + escapeHtml(user.nama || '') + '"/></div>' +
      '<div class="form-group"><label>Email</label><input type="email" id="p-email" value="' + escapeHtml(user.email || '') + '" readonly style="opacity:.7"/></div>' +
      '<div class="form-group"><label>No. HP / WhatsApp</label><input type="tel" id="p-hp" value="' + escapeHtml(user.hp || '') + '"/></div>' +
      '<div class="form-group"><label>Kode referral</label><input type="text" id="p-ref" value="' + escapeHtml(user.referral || '') + '" readonly style="opacity:.7"/></div>' +
      '<div class="msg error" id="err"></div>' +
      '<div class="msg success" id="saved"></div>' +
      '<button type="button" class="btn-primary" id="save-btn" style="max-width:240px">Simpan perubahan</button>' +
    '</div>';

  var preview = document.getElementById('avatar-preview');
  var removeBtn = document.getElementById('avatar-remove');
  var err = document.getElementById('err');

  function paintPreview() {
    if (pendingAvatar) {
      preview.style.backgroundImage = 'url(' + JSON.stringify(pendingAvatar) + ')';
      preview.textContent = '';
      preview.style.color = 'transparent';
      removeBtn.style.display = '';
    } else {
      preview.style.backgroundImage = '';
      preview.style.color = '';
      preview.textContent = initials(document.getElementById('p-nama').value || user.nama || 'U');
      removeBtn.style.display = 'none';
    }
  }
  paintPreview();

  document.getElementById('avatar-input').addEventListener('change', function (e) {
    err.classList.remove('show');
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) {
      err.textContent = 'Pilih file gambar.';
      err.classList.add('show');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 360, w = img.width, h = img.height;
        if (w > max || h > max) {
          var ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        if (dataUrl.length > 700000) {
          err.textContent = 'Foto terlalu besar. Coba resolusi lebih kecil.';
          err.classList.add('show');
          return;
        }
        pendingAvatar = dataUrl;
        paintPreview();
      };
      img.onerror = function () {
        err.textContent = 'Gagal membaca gambar.';
        err.classList.add('show');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', function () {
    pendingAvatar = null;
    document.getElementById('avatar-input').value = '';
    paintPreview();
  });

  document.getElementById('save-btn').addEventListener('click', function () {
    var next = {
      nama: document.getElementById('p-nama').value.trim() || user.nama,
      email: user.email,
      hp: document.getElementById('p-hp').value.trim(),
      referral: user.referral || '',
      avatar: pendingAvatar || null
    };
    setUser(next);
    try {
      var accounts = JSON.parse(localStorage.getItem('smartai_accounts') || '[]');
      for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].email && accounts[i].email.toLowerCase() === user.email.toLowerCase()) {
          accounts[i].nama = next.nama;
          accounts[i].hp = next.hp;
          accounts[i].avatar = next.avatar;
          break;
        }
      }
      localStorage.setItem('smartai_accounts', JSON.stringify(accounts));
    } catch (e) {}
    var msg = document.getElementById('saved');
    msg.textContent = 'Profil & foto disimpan.';
    msg.classList.add('show');
    setTimeout(function () { location.reload(); }, 600);
  });
})();
