function initTheme() {
  const saved = localStorage.getItem('smartai_theme');
  const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('smartai_theme', next); } catch (e) {}
  const btn = document.getElementById('theme-btn');
  if (btn) btn.innerHTML = themeIcon(next);
  return next;
}
function themeIcon(theme) {
  if (theme === 'light') {
    return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
  }
  return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
}
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function brandMark() {
  return '<a href="dashboard.html" class="brand-link" aria-label="Smart AI"><img src="../../img/logo-round.png" alt="" class="brand-logo" width="36" height="36"><strong class="brand-text">SMART<span>AI</span></strong></a>';
}
function avatarHtml(user) {
  var name = (user && (user.nama || user.name)) || 'M';
  var ini = name.split(/\s+/).map(function(p){ return p[0]; }).join('').slice(0,2).toUpperCase();
  return '<div class="avatar">' + escapeHtml(ini) + '</div>';
}
function logout() {
  try {
    localStorage.removeItem('smartai_user');
    localStorage.removeItem('smartai_token');
  } catch (e) {}
  location.href = '../login.html';
}
function renderShell(active) {
  const user = (typeof requireAuth === 'function') ? requireAuth() : (typeof getUser === 'function' ? getUser() : null);
  if (!user && typeof requireAuth === 'function') return null;
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const nav = [
    { id: 'dashboard', href: 'dashboard.html', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' },
    { id: 'performance', href: 'ea-performance.html', label: 'Acc Performance', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'clients', href: 'clients.html', label: 'My Clients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'referral', href: 'referral.html', label: 'Referral Network', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'trading-report', href: 'trading-report.html', label: 'Trading Report', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'commission', href: 'commission.html', label: 'Commission', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'transactions', href: 'transactions.html', label: 'Transactions', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { id: 'support', href: 'support.html', label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'profile', href: 'profile.html', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];
  const titleMap = { dashboard: 'Dashboard', performance: 'Acc Performance', clients: 'My Clients', referral: 'Referral Network', 'trading-report': 'Trading Report', commission: 'Commission', transactions: 'Transactions', support: 'Support', profile: 'My Profile' };
  const title = titleMap[active] || 'Dashboard';
  function paintShell() {
    document.body.innerHTML =
      '<div class="overlay" id="overlay"></div>' +
      '<aside class="sidebar" id="sidebar">' +
        '<div class="sidebar-brand" data-brand-logo="1">' + brandMark() + '</div>' +
        '<nav class="sidebar-nav">' +
          nav.map(function (n) {
            return '<a class="nav-item' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' +
              '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="' + n.icon + '"/></svg><span>' + n.label + '</span></a>';
          }).join('') +
        '</nav>' +
        '<div class="sidebar-foot">' +
          '<div class="user-chip">' + avatarHtml(user) + '<div><b>' + escapeHtml(user && user.nama || 'Member') + '</b><span>Member · Active</span></div></div>' +
          '<a class="nav-item" href="../index.html" style="margin-bottom:4px">' +
            '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg><span>Landing Page</span></a>' +
          '<button type="button" class="nav-item logout-side" onclick="logout()">' +
            '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Sign out</button></div></aside>' +
      '<div class="main"><header class="topbar"><div class="topbar-left">' +
            '<button class="menu-toggle" id="menu-toggle" aria-label="Menu"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
            '<div class="page-title">' + escapeHtml(title) + '</div></div>' +
          '<div class="topbar-right"><button type="button" class="theme-btn" id="theme-btn" aria-label="Toggle theme" title="Dark / Light">' + themeIcon(theme) + '</button></div></header>' +
        '<main class="content" id="page-content"></main></div>';
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.addEventListener('click', function () { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); });
    if (overlay) overlay.addEventListener('click', function () { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
    var themeBtn = document.getElementById('theme-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  }
  paintShell();
  if (window.__smartaiLogoReady && window.__smartaiLogoReady.then) {
    window.__smartaiLogoReady.then(function () {
      var el = document.querySelector('[data-brand-logo]');
      if (el && window.SmartAILogo) { try { el.innerHTML = window.SmartAILogo; } catch(e){} }
    });
  }
  return user;
}
initTheme();
