/* Daftar form handler (demo) */
(function () {
  var form = document.getElementById('daftar-form');
  var success = document.getElementById('form-success');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = form.nama.value.trim();
    var wa = form.wa.value.trim();
    if (!nama || !wa) {
      alert('Nama dan WhatsApp wajib diisi.');
      return;
    }
    form.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      success.classList.add('show');
    }
    // Optional: open WhatsApp with prefilled message
    var msg = encodeURIComponent('Halo, saya ' + nama + ' tertarik dengan Smart AI. WA: ' + wa);
    // window.open('https://wa.me/6282137585596?text=' + msg, '_blank');
  });
})();
