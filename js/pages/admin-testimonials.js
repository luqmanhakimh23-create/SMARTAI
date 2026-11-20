  (function () {
    const KEY = 'smartai_testimonials';
    const BAD_WORDS = ['bodoh', 'tolol', 'bangsat', 'anjir', 'kontol', 'memek', 'asu', 'tai', 'jancok', 'setan', 'brengsek', 'bajingan'];
    function getList() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    }
    function saveList(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
    function stars(n) {
      n = Math.max(0, Math.min(5, Number(n) || 0));
      let s = '';
      for (let i = 1; i <= 5; i++) s += i <= n ? '★' : '☆';
      return s;
    }
    function initials(name) {
      return String(name || 'SA').split(/\s+/).map(p => p[0] || '').join('').slice(0, 2).toUpperCase();
    }
    function esc(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function isFlagged(text) {
      const t = String(text || '').toLowerCase();
      return BAD_WORDS.some(w => t.includes(w));
    }
    function stats(list) {
      const total = list.length;
      const avg = total ? (list.reduce((s, c) => s + (Number(c.rating) || 0), 0) / total) : null;
      const low = list.filter(c => (Number(c.rating) || 0) <= 2).length;
      const flagged = list.filter(c => isFlagged(c.comment)).length;
      document.getElementById('stat-total').textContent = total;
      document.getElementById('stat-avg').textContent = avg == null ? '—' : avg.toFixed(1);
      document.getElementById('stat-low').textContent = low;
      document.getElementById('stat-flag').textContent = flagged;
    }
    function filtered() {
      let list = getList().slice().reverse();
      const q = (document.getElementById('q').value || '').trim().toLowerCase();
      const fr = document.getElementById('filter-rating').value;
      const fs = document.getElementById('filter-status').value;
      if (q) list = list.filter(c => String(c.name || '').toLowerCase().includes(q) || String(c.comment || '').toLowerCase().includes(q) || String(c.userId || '').toLowerCase().includes(q));
      if (fr) list = list.filter(c => String(c.rating) === fr);
      if (fs) list = list.filter(c => c.status === fs);
      return list;
    }
    function render() {
      const all = getList();
      stats(all);
      const list = filtered();
      const tbody = document.getElementById('tbody');
      const empty = document.getElementById('empty');
      const table = tbody.closest('table');
      document.getElementById('list-count').textContent = list.length + ' ulasan';
      if (!list.length) {
        tbody.innerHTML = '';
        table.hidden = true;
        empty.hidden = false;
        return;
      }
      table.hidden = false;
      empty.hidden = true;
      tbody.innerHTML = list.map(c => {
        const flag = isFlagged(c.comment);
        return '<tr data-id="' + esc(c.id) + '">' +
          '<td><div class="member-cell"><div class="avatar">' + esc(initials(c.name)) + '</div><div><div class="name">' + esc(c.name || 'Member') + '</div><div class="sub">' + esc(c.package || c.userId || '') + '</div></div></div></td>' +
          '<td><span class="stars">' + stars(c.rating) + '</span></td>' +
          '<td class="comment-cell">"' + esc(c.comment) + '"' + (flag ? ' <span class="status-pill flag-pill">kata kasar</span>' : '') + '</td>' +
          '<td><span class="status-pill status-' + esc(c.status || 'pending') + '">' + esc(c.status || 'pending') + '</span></td>' +
          '<td style="white-space:nowrap;color:var(--text-muted);font-size:.82rem">' + esc(c.createdAt || '—') + '</td>' +
          '<td><div class="actions">' +
            (c.status !== 'approved' ? '<button type="button" class="btn-sm btn-approve" data-act="approved" data-id="' + esc(c.id) + '">Approve</button>' : '') +
            (c.status !== 'rejected' ? '<button type="button" class="btn-sm btn-reject" data-act="rejected" data-id="' + esc(c.id) + '">Reject</button>' : '') +
            '<button type="button" class="btn-sm btn-del" data-act="delete" data-id="' + esc(c.id) + '">Hapus</button>' +
          '</div></td></tr>';
      }).join('');
      tbody.querySelectorAll('[data-act]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const act = btn.dataset.act;
          let list = getList();
          if (act === 'delete') {
            if (!confirm('Hapus ulasan ini permanen?')) return;
            list = list.filter(x => x.id !== id);
          } else {
            const item = list.find(x => x.id === id);
            if (item) item.status = act;
          }
          saveList(list);
          render();
        });
      });
    }
    document.getElementById('q').addEventListener('input', render);
    document.getElementById('filter-rating').addEventListener('change', render);
    document.getElementById('filter-status').addEventListener('change', render);
    document.getElementById('btn-reload').addEventListener('click', render);
    render();
  })();
  
