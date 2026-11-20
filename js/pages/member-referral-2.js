const user = renderShell('referral');
if (user) {
  var MAX_LEVEL = 5, TOTAL_PER_LOT = 15, DIRECT_SPONSOR = 13, UPLINE_POOL = 2;
  function rateForYou(level) {
    level = Number(level) || 0;
    if (level < 1 || level > MAX_LEVEL) return 0;
    if (level === 1) return TOTAL_PER_LOT;
    return UPLINE_POOL / (level - 1);
  }
  function rateLabel(level) {
    var r = rateForYou(level);
    return r === Math.floor(r) ? '$' + r : '$' + r.toFixed(2);
  }
  var refCode = (user.referral && user.referral.trim()) ? user.referral.trim().toUpperCase() : 'SMARTAI-REF';
  var refLink = location.origin + location.pathname.replace(/[^/]+$/, '') + 'register.html?ref=' + encodeURIComponent(refCode);
  var network = [
    { id:'M2A', name:'Fajar S.', level:1, lots:12, invitedBy:'YOU' },
    { id:'M2B', name:'Maya L.', level:1, lots:8, invitedBy:'YOU' },
    { id:'M2C', name:'Rizky K.', level:1, lots:5, invitedBy:'YOU' },
    { id:'M3A', name:'Tono H.', level:2, lots:6, invitedBy:'M2A' },
    { id:'M3B', name:'Nina A.', level:2, lots:4, invitedBy:'M2A' },
    { id:'M3C', name:'Dina W.', level:2, lots:3, invitedBy:'M2B' },
    { id:'M4A', name:'Andi R.', level:3, lots:5, invitedBy:'M3A' },
    { id:'M4B', name:'Fira L.', level:3, lots:2, invitedBy:'M3B' },
    { id:'M5A', name:'Wati A.', level:4, lots:3, invitedBy:'M4A' },
    { id:'M6A', name:'Lulu P.', level:5, lots:2, invitedBy:'M5A' }
  ];
  function earnFromMember(level, lots) { return rateForYou(level) * (Number(lots) || 0); }
  function totalYouEarn() { return network.reduce(function(s,m){ return s + earnFromMember(m.level, m.lots); }, 0); }
  function levelStats() {
    var out = {}; for (var L=1;L<=MAX_LEVEL;L++) out[L]={count:0,lots:0,earn:0};
    network.forEach(function(m){ if(!out[m.level])return; out[m.level].count++; out[m.level].lots+=m.lots; out[m.level].earn+=earnFromMember(m.level,m.lots); });
    return out;
  }
  function byId(id){ for(var i=0;i<network.length;i++) if(network[i].id===id) return network[i]; return null; }
  function childrenOf(parentId){ return network.filter(function(m){ return m.invitedBy===parentId; }); }
  function initials(name){ return String(name||'').split(/\s+/).map(function(p){return p[0];}).join('').slice(0,2).toUpperCase(); }
  function fmt(n){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n); }
  function parentName(invitedBy){ if(invitedBy==='YOU') return 'kamu'; var p=byId(invitedBy); return p?p.name:invitedBy; }
  function getInvitedBy(id){ var m=byId(id); return m?m.invitedBy:'YOU'; }
  var stats = levelStats();
  var totalEarn = totalYouEarn();
  var totalLots = network.reduce(function(s,m){return s+m.lots;},0);
  var totalMembers = network.length;
  function buildTree(){
    return { id:'YOU', name:(user.nama||'Kamu'), level:0, lots:0, children: childrenOf('YOU').map(attachChildren) };
  }
  function attachChildren(node){
    return { id:node.id, name:node.name, level:node.level, lots:node.lots, earn:earnFromMember(node.level,node.lots), children:childrenOf(node.id).map(attachChildren) };
  }
  function renderVisualTree(root){
    function cardHtml(n, depth){
      var cls = depth === 0 ? 'root' : ('l' + depth);
      var html = '<div class="org-card ' + cls + '">';
      html += '<div class="av">' + escapeHtml(initials(n.name)) + '</div>';
      html += '<div class="n-name">' + escapeHtml(n.name) + '</div>';
      if (depth === 0) html += '<div class="n-meta">Sponsor (kamu)</div>';
      else {
        html += '<div class="n-meta">L' + depth + ' · ' + rateLabel(depth) + '/lot</div>';
        html += '<div class="n-lots">' + n.lots + ' lot</div>';
        html += '<div class="n-earn">+' + fmt(n.earn) + '</div>';
      }
      return html + '</div>';
    }
    function renderNode(n, depth){
      depth = depth || 0;
      if (depth > MAX_LEVEL) return '';
      var kids = n.children || [];
      var html = '<div class="org-node-wrap">' + cardHtml(n, depth);
      if (kids.length) {
        html += '<div class="org-vline" title="membawa"></div>';
        html += '<div class="org-children">';
        kids.forEach(function(ch){
          html += '<div class="org-child">';
          html += '<div class="org-drop"></div>';
          html += '<div class="org-invite">' + (depth === 0 ? 'ajak' : escapeHtml((n.name||'').split(' ')[0])) + ' →</div>';
          html += renderNode(ch, depth + 1);
          html += '</div>';
        });
        html += '</div>';
      }
      return html + '</div>';
    }
    return '<div class="org-tree">' + renderNode(root, 0) + '</div>';
  }
  function renderHierListFixed(node, depth){
    depth=depth||0; if(depth>MAX_LEVEL) return '';
    var hasKids=node.children&&node.children.length>0;
    var earn=node.level>0?node.earn:0;
    var avCls=node.level>0?'l'+node.level:'';
    var meta=node.level===0?'Root · sponsor jaringan':'Level '+node.level+' · diajak oleh '+parentName(getInvitedBy(node.id));
    var html='<div class="hier-item"><div class="hier-row">';
    html+='<button type="button" class="hier-toggle'+(hasKids?'':' leaf')+'" data-toggle="'+escapeHtml(node.id)+'">'+(hasKids?'▾':'')+'</button>';
    html+='<div class="hier-av '+avCls+'">'+escapeHtml(initials(node.name))+'</div>';
    html+='<div><div class="hier-name">'+escapeHtml(node.name)+(node.level===0?' <span style="color:var(--cyan);font-size:.72rem">(kamu)</span>':'')+'</div><div class="hier-meta">'+meta+'</div></div>';
    if(node.level>0){ html+='<div class="hier-lots">'+node.lots+' lot</div><div class="hier-earn">+'+fmt(earn)+'</div>'; }
    else html+='<div class="hier-lots"></div><div class="hier-earn"></div>';
    html+='</div>';
    if(hasKids){
      html+='<div class="hier-children'+(depth<2?' open':'')+'" data-children="'+escapeHtml(node.id)+'">';
      node.children.forEach(function(ch){ html+=renderHierListFixed(ch, depth+1); });
      html+='</div>';
    }
    return html+'</div>';
  }
  var tree = buildTree();
  var levelRows = '';
  for (var L=1;L<=MAX_LEVEL;L++){
    var posTxt = L===1 ? 'Direct — kamu sponsor langsung ($15)' : 'Sponsor langsung $13 · sisa $2 dibagi '+(L-1)+' upline';
    levelRows += '<tr><td><span class="level-pill">L'+L+'</span></td><td>'+posTxt+'</td><td><strong>'+rateLabel(L)+'</strong> / lot (ke kamu)</td><td>'+stats[L].count+' member</td><td>'+fmt(stats[L].earn)+'</td></tr>';
  }
  document.getElementById('page-content').innerHTML =
    '<div class="page-header"><div><h1>Referral Network</h1><p>Pohon koneksi 5 level — garis menunjukkan <strong>siapa membawa siapa</strong>. Komisi total <strong>$15/lot</strong>.</p></div></div>'+
    '<div class="ref-share">'+
      '<h3>Kode referral kamu</h3>'+
      '<p class="sub">Bagikan kode atau link ini agar downline masuk di bawah jaringanmu.</p>'+
      '<div class="row"><label>Kode</label><code id="ref-code">'+escapeHtml(refCode)+'</code>'+
        '<button type="button" class="btn-copy" id="copy-code">Salin kode</button></div>'+
      '<div class="row"><label>Link</label><code id="ref-link" style="font-size:.72rem;word-break:break-all;flex:1;min-width:180px">'+escapeHtml(refLink)+'</code>'+
        '<button type="button" class="btn-copy" id="copy-link">Salin link</button></div>'+
    '</div>'+
    '<div class="stats-grid">'+
      '<div class="stat-card"><div class="label">Estimasi komisi (demo)</div><div class="value up">'+fmt(totalEarn)+'</div><div class="hint">Dari volume lot jaringan</div></div>'+
      '<div class="stat-card"><div class="label">Member di network</div><div class="value">'+totalMembers+'</div><div class="hint">Level 1–5</div></div>'+
      '<div class="stat-card"><div class="label">Total lot downline</div><div class="value">'+totalLots+'</div><div class="hint">Bulan ini</div></div>'+
      '<div class="stat-card"><div class="label">Direct (L1)</div><div class="value">'+stats[1].count+'</div><div class="hint">'+fmt(stats[1].earn)+' dari L1</div></div></div>'+
    '<div class="panel tree-panel"><div class="panel-head"><h2>Pohon Koneksi</h2><span class="sub">Garis = relasi ajak</span></div>'+
      '<div class="tree-wrap">'+renderVisualTree(tree)+'</div>'+
      '<div class="tree-legend"><span><i class="l1"></i> L1 → kamu $15</span><span><i class="l2"></i> L2 → kamu $2</span><span><i class="l3"></i> L3 → kamu $1</span><span><i class="l4"></i> L4 → kamu $0.67</span><span><i class="l5"></i> L5 → kamu $0.50</span></div>'+
      '<div class="mt5-note"><strong>Cara baca:</strong> garis vertikal + horizontal menghubungkan parent ke child. Label <em>ajak →</em> menunjukkan siapa yang mengajak. Komisi: sponsor langsung $13 (L1: kamu $15), sisa $2 dibagi upline.</div></div>'+
    '<div class="panel hier-list"><div class="panel-head"><h2>Detail Jaringan (hierarki)</h2><span class="sub">Klik ▾ buka/tutup · garis kiri = cabang</span></div>'+renderHierListFixed(tree,0)+'</div>'+
    '<div class="ref-grid" style="margin-top:1.25rem"><div class="rule-card">'+
      '<h3>Aturan komisi per 1 lot (total $15)</h3>'+
      '<p class="sub">Sponsor langsung <strong>$13</strong>, sisa <strong>$2</strong> dibagi rata ke upline di atasnya. L1: kamu dapat penuh <strong>$15</strong>.</p>'+
      '<table class="level-table"><thead><tr><th>Level</th><th>Distribusi</th><th>Ke kamu</th><th>Member</th><th>Estimasi</th></tr></thead><tbody>'+levelRows+'</tbody></table>'+
      '<div class="flow-box"><strong>Contoh alur (1 lot):</strong><br/>'+
        '<strong>L1</strong> trade → kamu <strong>$15</strong>.<br/>'+
        '<strong>L2</strong> trade → L1 <strong>$13</strong>, kamu <strong>$2</strong>.<br/>'+
        '<strong>L3</strong> trade → L2 <strong>$13</strong>, L1+kamu <strong>$1</strong> masing-masing.<br/>'+
        '<strong>L4</strong> trade → L3 <strong>$13</strong>, kamu/L1/L2 ≈ <strong>$0.67</strong>.<br/>'+
        '<strong>L5</strong> trade → L4 <strong>$13</strong>, 4 upline <strong>$0.50</strong>.</div></div>'+
    '<div><div class="calc-box"><h3 style="font-size:1rem;font-weight:800;margin-bottom:.85rem">Kalkulator cepat</h3>'+
      '<label>Level downline</label><select id="calc-level">'+
        '<option value="1">Level 1 — $15/lot ke kamu</option><option value="2">Level 2 — $2/lot ke kamu</option>'+
        '<option value="3">Level 3 — $1/lot ke kamu</option><option value="4">Level 4 — $0.67/lot ke kamu</option>'+
        '<option value="5">Level 5 — $0.50/lot ke kamu</option></select>'+
      '<label>Volume lot (MT-5)</label><input id="calc-lots" type="number" min="0" step="0.01" value="10" />'+
      '<div class="calc-result" id="calc-out"></div></div></div></div>';
  document.querySelectorAll('.hier-toggle:not(.leaf)').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id=btn.getAttribute('data-toggle');
      var child=document.querySelector('[data-children="'+id+'"]');
      if(!child) return;
      var open=child.classList.toggle('open');
      btn.textContent=open?'▾':'▸';
    });
  });
  function renderCalc(){
    var level=parseInt(document.getElementById('calc-level').value,10);
    var lots=parseFloat(document.getElementById('calc-lots').value)||0;
    var rate=rateForYou(level), you=rate*lots;
    var html='<div class="calc-row"><span>Rate ke kamu (L'+level+')</span><span class="amt">'+rateLabel(level)+' / lot</span></div>';
    html+='<div class="calc-row"><span>Volume MT-5</span><span class="amt">'+lots+' lot</span></div>';
    if(level===1) html+='<div class="calc-row"><span>Distribusi</span><span class="amt">Kamu (sponsor) $15</span></div>';
    else { html+='<div class="calc-row"><span>Sponsor langsung</span><span class="amt">$13 / lot</span></div>';
           html+='<div class="calc-row"><span>Pool upline ($2 ÷ '+(level-1)+')</span><span class="amt">'+rateLabel(level)+' / lot</span></div>'; }
    html+='<div class="calc-row total"><span>Kamu terima</span><span class="amt">'+fmt(you)+'</span></div>';
    html+='<div style="margin-top:.85rem;font-size:.75rem;color:var(--text-dim);line-height:1.45">Total per 1 lot selalu <strong style="color:var(--text)">$15</strong>.</div>';
    document.getElementById('calc-out').innerHTML=html;
  }
  document.getElementById('calc-level').onchange=renderCalc;
  document.getElementById('calc-lots').oninput=renderCalc;
  renderCalc();
  function copyText(text, btn){
    function ok(){ var old=btn.textContent; btn.textContent='Tersalin ✓'; setTimeout(function(){btn.textContent=old},1500); }
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok).catch(function(){fallback();});
    else fallback();
    function fallback(){ var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');ok()}catch(e){} document.body.removeChild(ta); }
  }
  document.getElementById('copy-code').onclick=function(){ copyText(document.getElementById('ref-code').textContent, this); };
  document.getElementById('copy-link').onclick=function(){ copyText(document.getElementById('ref-link').textContent, this); };
}
