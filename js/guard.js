/* Guard halaman dashboard: kalau belum login, langsung ke halaman login. */
(function () {
  try {
    if (!localStorage.getItem('smartai_admin')) location.replace('index.html');
  } catch (e) {
    location.replace('index.html');
  }
})();
