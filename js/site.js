const html = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);
var themeBtn = document.getElementById('theme-toggle');
if (themeBtn) themeBtn.addEventListener('click', () => {
  const n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', n);
  localStorage.setItem('theme', n);
});
const hamburger = document.getElementById('hamburger'), mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
function toggleFaq(btn) {
  const item = btn.parentElement;
  const was = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  if (!was) item.classList.add('active');
}
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

(function loadBrandLogo() {
  function injectCss() {
    if (document.getElementById('smartai-logo-css')) return;
    var s = document.createElement('style');
    s.id = 'smartai-logo-css';
    s.textContent = '.logo{display:inline-flex;align-items:center}.logo-img{height:42px;width:auto;display:block;object-fit:contain}footer .logo-img{height:36px}';
    document.head.appendChild(s);
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var sc = document.createElement('script');
      sc.src = src;
      sc.onload = resolve;
      sc.onerror = reject;
      document.head.appendChild(sc);
    });
  }
  injectCss();
  loadScript('../js/logo-a.js')
    .then(function () { return loadScript('../js/logo-b.js'); })
    .then(function () { if (window.applySmartAILogos) window.applySmartAILogos(); })
    .catch(function () {});
})();

/* AUTH-AWARE NAV: if logged in, show Dashboard/Portal instead of Login */
(function () {
  function getLoggedUser() {
    try {
      var raw = localStorage.getItem('smartai_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function applyAuthNav() {
    var user = getLoggedUser();
    if (!user) return;
    var dashHref = 'member/dashboard.html';
    if (location.pathname.indexOf('/member/') !== -1) dashHref = 'dashboard.html';

    var actions = document.querySelector('.nav-actions');
    if (actions) {
      var reg = actions.querySelector('a.btn-nav, a[href*="daftar"]');
      var log = actions.querySelector('a.btn-login, a[href*="login"]');
      if (reg) {
        reg.href = dashHref;
        reg.textContent = 'Dashboard';
        reg.classList.remove('btn-nav');
        reg.classList.add('btn-login');
      }
      if (log) {
        log.href = dashHref;
        log.textContent = 'Portal';
        log.classList.add('btn-primary');
      }
      if (!reg && !log) {
        var a = document.createElement('a');
        a.href = dashHref;
        a.className = 'btn btn-login';
        a.textContent = 'Dashboard';
        var ham = actions.querySelector('.hamburger');
        if (ham) actions.insertBefore(a, ham);
        else actions.appendChild(a);
      }
    }

    var mobile = document.getElementById('mobile-menu');
    if (mobile) {
      var mLogin = mobile.querySelector('a[href*="login"]');
      var mReg = mobile.querySelector('a[href*="daftar"]');
      if (mLogin) {
        mLogin.href = dashHref;
        mLogin.textContent = 'Dashboard / Portal';
        mLogin.onclick = closeMenu;
      }
      if (mReg) {
        mReg.href = dashHref;
        mReg.textContent = 'Masuk Portal';
        mReg.onclick = closeMenu;
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAuthNav);
  } else {
    applyAuthNav();
  }
})();
