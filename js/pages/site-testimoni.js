    (function() {
      const STORAGE_KEY = 'smartai_testimonials';
      const SEED = [
        { id: 'seed1', name: 'Andi R.', package: 'Smart Gold', rating: 5, comment: 'Setup simpel, monitoring transparan.', status: 'approved', createdAt: '2025-10-01' },
        { id: 'seed2', name: 'Sari W.', package: 'Smart Basic', rating: 5, comment: 'Risk control jelas, parameter bisa disesuaikan.', status: 'approved', createdAt: '2025-10-05' },
        { id: 'seed3', name: 'Budi P.', package: 'Smart Pro', rating: 4, comment: 'Support aktif dan panduan membantu pemula.', status: 'approved', createdAt: '2025-10-12' }
      ];

      function getComments() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
            return SEED.slice();
          }
          return JSON.parse(raw);
        } catch (e) { return SEED.slice(); }
      }

      function saveComments(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      function getUser() {
        try {
          const u = localStorage.getItem('smartai_user');
          return u ? JSON.parse(u) : null;
        } catch (e) { return null; }
      }

      function starsHtml(n) {
        let s = '';
        for (let i = 1; i <= 5; i++) s += i <= n ? '★' : '☆';
        return s;
      }

      function initials(name) {
        return (name || 'SA').split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();
      }

      function esc(s) {
        return String(s == null ? '' : s)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      function renderList() {
        const list = getComments().filter(c => c.status === 'approved');
        const container = document.getElementById('testi-list');
        if (!list.length) {
          container.innerHTML = '<div class="empty-state">Belum ada testimoni yang disetujui.</div>';
          return;
        }
        container.innerHTML = list.map(c => `
          <div class="testi-card reveal">
            <div class="testi-stars">${starsHtml(c.rating)}</div>
            <p>"${esc(c.comment)}"</p>
            <div class="testi-meta">
              <span class="testi-avatar">${initials(c.name)}</span>
              ${esc(c.name)}${c.package ? ' · ' + esc(c.package) : ''}
            </div>
          </div>
        `).join('');

        const avgBox = document.getElementById('avg-rating');
        if (list.length) {
          const avg = list.reduce((s, c) => s + c.rating, 0) / list.length;
          document.getElementById('avg-score').textContent = avg.toFixed(1);
          document.getElementById('avg-stars').textContent = starsHtml(Math.round(avg));
          document.getElementById('avg-count').textContent = list.length + ' ulasan';
          avgBox.style.display = 'flex';
        }
      }

      function renderForm() {
        const user = getUser();
        const area = document.getElementById('form-area');
        if (!user) {
          area.innerHTML = `
            <div class="login-prompt">
              <p>Login dulu untuk menulis testimoni & memberi rating.</p>
              <a href="login.html" class="btn btn-primary">Login sekarang</a>
            </div>`;
          return;
        }

        const list = getComments();
        const mine = list.find(c => c.userId === (user.email || user.id) && (c.status === 'pending' || c.status === 'approved'));
        if (mine) {
          area.innerHTML = `
            <div class="login-prompt">
              <p>Kamu sudah mengirim testimoni.
                ${mine.status === 'pending' ? '<span class="pending-badge">Menunggu review admin</span>' : '<span class="pending-badge" style="background:rgba(52,211,153,.12);color:var(--green);border-color:rgba(52,211,153,.3)">Sudah disetujui</span>'}
              </p>
              <p style="font-size:.85rem;margin-top:.5rem;color:var(--text-dim)">"${esc(mine.comment)}"</p>
            </div>`;
          return;
        }

        area.innerHTML = `
          <div class="rating-input" id="rating-stars">
            <span data-v="1">☆</span><span data-v="2">☆</span><span data-v="3">☆</span><span data-v="4">☆</span><span data-v="5">☆</span>
          </div>
          <textarea id="comment-text" placeholder="Tulis pengalamanmu memakai Smart AI..." maxlength="400"></textarea>
          <button class="btn btn-primary btn-submit" id="btn-submit">Kirim Testimoni</button>
          <p style="font-size:.78rem;color:var(--text-dim);margin-top:.75rem">Komentar akan ditinjau admin sebelum muncul di halaman ini.</p>
        `;

        let rating = 0;
        const stars = document.querySelectorAll('#rating-stars span');
        stars.forEach(el => {
          el.addEventListener('click', () => {
            rating = Number(el.dataset.v);
            stars.forEach(s => {
              const v = Number(s.dataset.v);
              s.textContent = v <= rating ? '★' : '☆';
              s.classList.toggle('active', v <= rating);
            });
          });
        });

        document.getElementById('btn-submit').addEventListener('click', () => {
          const text = (document.getElementById('comment-text').value || '').trim();
          if (!rating) { alert('Pilih rating bintang dulu.'); return; }
          if (text.length < 10) { alert('Komentar minimal 10 karakter.'); return; }

          const list = getComments();
          list.push({
            id: 't_' + Date.now(),
            userId: user.email || user.id || 'anon',
            name: user.nama || user.name || 'Member',
            package: user.package || '',
            rating,
            comment: text,
            status: 'pending',
            createdAt: new Date().toISOString().slice(0, 10)
          });
          saveComments(list);
          renderForm();
          alert('Terima kasih! Testimoni kamu menunggu review admin.');
        });
      }

      renderList();
      renderForm();
    })();
    
