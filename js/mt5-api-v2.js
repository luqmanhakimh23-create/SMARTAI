/* SMARTAI MT5 API v2 — full sync + demo fallback + daily clamp — 2026-11-19 */
(function (w) {
  'use strict';

  var LIVE_BASE = 'https://script.google.com/macros/s/AKfycbw8AEMeie38BBxW3S-22bf0WrI_7vGHPkpANGEsoQiTv7Jg86X8rrTEQ3AtDyzQol5D_Q/exec';

  var ACCOUNT_META = {
    ACC01: { package: 'Smart Basic', login: '100000052', owner: 'willy', server: 'TrijayaPratamaFutures-Live', broker_label: 'PT. Trijaya Pratama Futures', mode: 'Hedge · Access Server' },
    ACC02: { package: 'Smart Gold', login: null, owner: null, server: null, broker_label: 'PT. Trijaya Pratama Futures', mode: null },
    ACC03: { package: 'Smart Pro', login: null, owner: null, server: null, broker_label: 'Exness Technologies Ltd', mode: null }
  };

  var demoAccounts = [
    { account_id:'ACC01', status:'DEMO', balance:89795.21, equity:90786.35, deposit_awal:10000.00, daily_profit:991.14, total_profit:80795.21, daily_dd:1.2, total_penarikan:73862.00, updated_at:'DEMO DATA', name:'Smart Basic', broker:'Trijaya pratama futures' },
    { account_id:'ACC02', status:'DEMO', balance:106455.80, equity:106793.83, deposit_awal:10000.00, daily_profit:338.03, total_profit:96455.80, daily_dd:0.8, total_penarikan:28000.00, updated_at:'DEMO DATA', name:'Smart Gold' },
    { account_id:'ACC03', status:'DEMO', balance:645950.70, equity:656274.00, deposit_awal:60000.00, daily_profit:10323.30, total_profit:585950.70, daily_dd:2.1, total_penarikan:5540000.00, updated_at:'DEMO DATA', name:'Smart Pro' }
  ];

  var cache = { accounts: null, isLive: false, fetchedAt: null, error: null, inflightAccounts: null };
  var FRESH_MS = 25000;

  function formatUSD(value) {
    if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) return '\u2014';
    return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:2 }).format(Number(value));
  }
  function formatNumber(value, digits) {
    if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) return '\u2014';
    return Number(value).toLocaleString('en-US', { minimumFractionDigits:digits || 2, maximumFractionDigits:digits || 2 });
  }
  function escape(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function apiUrl(action) {
    return LIVE_BASE + '?action=' + encodeURIComponent(action);
  }
  function num(v) {
    if (v === null || v === undefined || v === '' || !isFinite(Number(v))) return null;
    return Number(v);
  }
  function normalizeAccount(a) {
    if (!a || typeof a !== 'object') return null;
    var id = String(a.account_id || a.id || '');
    if (!id) return null;
    var meta = ACCOUNT_META[id] || {};
    var dp = num(a.daily_profit);
    if (dp == null || !Number.isFinite(dp) || Math.abs(dp) > 500000) dp = 0;
    return {
      account_id: id, name: a.name || meta.package || null, package: meta.package || a.name || null,
      login: meta.login || null, owner: meta.owner || null, server: meta.server || null,
      broker: a.broker || meta.broker_label || null, broker_label: meta.broker_label || a.broker || null,
      mode: meta.mode || null, status: a.status || 'WAITING',
      balance: num(a.balance), equity: num(a.equity), deposit_awal: num(a.deposit_awal),
      daily_profit: dp, total_profit: num(a.total_profit),
      daily_dd: num(a.daily_dd), total_dd: num(a.total_dd),
      total_penarikan: num(a.total_penarikan != null ? a.total_penarikan : a.total_withdrawal),
      updated_at: a.updated_at || null
    };
  }
  function cloneAccounts(list) {
    return (list || []).map(function(a){ return Object.assign({}, a); });
  }
  function fetchJson(url, timeoutMs) {
    timeoutMs = timeoutMs || 8000;
    return new Promise(function(resolve, reject) {
      var done = false;
      var timer = setTimeout(function() { if (done) return; done = true; reject(new Error('Timeout')); }, timeoutMs);
      fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', headers: { 'Accept': 'application/json' } })
        .then(function(res) { if (done) return; if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function(data) { if (done) return; done = true; clearTimeout(timer); resolve(data); })
        .catch(function(err) { if (done) return; done = true; clearTimeout(timer); reject(err); });
    });
  }
  function fetchAccountsNetwork() {
    if (cache.inflightAccounts) return cache.inflightAccounts;
    cache.inflightAccounts = fetchJson(apiUrl('live'), 8000).then(function(data) {
      if (!data || !data.ok || !Array.isArray(data.accounts)) throw new Error('Invalid live response');
      var list = data.accounts.map(normalizeAccount).filter(Boolean);
      if (!list.length) throw new Error('No accounts');
      cache.accounts = list; cache.isLive = true; cache.fetchedAt = Date.now(); cache.error = null;
      return list;
    }).catch(function(err) {
      cache.error = err && err.message ? err.message : String(err);
      cache.isLive = false; throw err;
    }).finally(function() { cache.inflightAccounts = null; });
    return cache.inflightAccounts;
  }
  async function getAccounts(force) {
    var age = cache.fetchedAt ? (Date.now() - cache.fetchedAt) : Infinity;
    if (!force && cache.accounts && age < FRESH_MS) return cloneAccounts(cache.accounts);
    try {
      var list = await fetchAccountsNetwork();
      if (!list || !list.length) return demoAccounts.map(function(a){ return normalizeAccount(a); });
      return cloneAccounts(list);
    } catch (err) {
      if (cache.accounts && cache.accounts.length) return cloneAccounts(cache.accounts);
      return demoAccounts.map(function(a){ return normalizeAccount(a); });
    }
  }
  function getAccountMeta(id) {
    return ACCOUNT_META[id] ? Object.assign({}, ACCOUNT_META[id]) : null;
  }
  try {
    if (typeof document !== 'undefined') {
      var boot = function() { getAccounts(false).catch(function(){}); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
      else boot();
    }
  } catch (e) {}

  w.SmartAIMT5 = {
    base: 'LIVE',
    getAccounts: getAccounts,
    getDailyHistory: async function(){ return []; },
    getAccountMeta: getAccountMeta,
    formatUSD: formatUSD,
    formatNumber: formatNumber,
    escape: escape,
    isLive: function(){ return !!cache.isLive; },
    lastError: function(){ return cache.error; },
    lastFetchedAt: function(){ return cache.fetchedAt; }
  };
})(window);
