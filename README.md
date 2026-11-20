# Smart AI — Unified System

Satu sistem yang menggabungkan **Landing**, **Member Dashboard**, dan **Admin Panel**.

## Struktur

```
smartai/
├── index.html              → pintu masuk, langsung mengarah ke html/index.html
├── html/                   → semua halaman
│   ├── index.html          → Landing page (publik)
│   ├── login.html, daftar.html, register.html
│   ├── faq.html, produk.html, kelebihan.html, video.html, testimoni.html, performance.html, our-story.html
│   ├── member/             → Portal member (setelah login)
│   │   └── dashboard.html, clients.html, commission.html, referral.html, ...
│   └── admin/              → Panel admin
│       └── index.html (login admin), dashboard.html, members.html, accounts.html, ...
├── css/                    → Stylesheet global (site, app, admin, login, landing-theme, ...)
│   └── pages/              → CSS khusus per halaman (dulu inline di <style>)
├── js/                     → Script global (site, app, auth, admin, mt5-api, ...)
│   ├── pages/              → JS admin + JS khusus per halaman (dulu inline di <script>)
│   └── _unused/            → file lama yang tidak dipakai halaman manapun
└── img/                    → logo, gambar latar, ikon
```

Penamaan file per halaman: `<lingkup>-<halaman>.css|js`, contoh `member-dashboard.js`,
`admin-testimonials.css`, `site-login.css` (`site` = halaman publik di `html/`).

## Cara menjalankan

Buka folder ini dengan static server, contoh:

```bash
npx serve .
# atau
python3 -m http.server 8080
```

Lalu buka: http://localhost:8080 (otomatis ke `html/index.html`)

## Alur

1. **Landing** (`/`) → publik, tombol Login & Registrasi
2. **Login member** → `html/login.html`  
   Demo: `demo@smartai.id` / `demo123`
3. Setelah login → `html/member/dashboard.html`
4. **Admin** → `html/admin/index.html`  
   Demo: `admin@smartai.id` / `admin123`
5. Setelah login admin → `html/admin/dashboard.html`

## Catatan

- Auth & data masih **mock** (localStorage). Bukan produksi.
- Tema dark/light tersimpan di `localStorage` (`smartai_theme`).
- Member session key: `smartai_user` / auth key di `auth.js`
- Admin session key: `smartai_admin`
