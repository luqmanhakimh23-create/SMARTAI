if (renderShell('risk')) {
 document.getElementById('page-content').innerHTML = `
 <div class="page-header"><div><h1>Risk & Privacy Notice</h1><p>Informasi penting tentang batasan prototype Smart AI.</p></div></div>
 <section class="panel"><h2 style="margin-bottom:.7rem">1. Ini hanya demonstrasi</h2><p style="color:var(--text-muted);line-height:1.75">Seluruh angka saldo, equity, performa, profit, win rate, akun, komisi, referral, dan riwayat pada halaman ini adalah data ilustratif. Data tidak berasal dari broker atau akun trading dan tidak membuktikan hasil masa lalu maupun hasil masa depan.</p></section>
 <section class="panel"><h2 style="margin-bottom:.7rem">2. Risiko aktivitas pasar</h2><p style="color:var(--text-muted);line-height:1.75">Aktivitas pada pasar keuangan dapat mengalami perubahan harga dan kerugian. Tidak ada grafik, robot, sistem otomatis, atau angka contoh yang menjamin keuntungan. Halaman ini bukan rekomendasi atau ajakan untuk melakukan transaksi.</p></section>
 <section class="panel"><h2 style="margin-bottom:.7rem">3. Privasi dan keamanan</h2><p style="color:var(--text-muted);line-height:1.75">Prototype menyimpan data akun demo di penyimpanan browser (localStorage), yang dapat diakses dan diubah melalui perangkat pengguna. Jangan memasukkan kata sandi asli, nomor rekening, data identitas, atau informasi keuangan sensitif. Jangan memakai kata sandi yang sama dengan layanan lain.</p></section>
 <section class="panel"><h2 style="margin-bottom:.7rem">4. Integrasi belum aktif</h2><p style="color:var(--text-muted);line-height:1.75">Portal ini belum terhubung ke backend, database, broker, MT4/MT5, layanan pembayaran, atau sistem verifikasi lisensi. Status yang terlihat bukan status koneksi atau lisensi sungguhan. Tidak ada deposit atau penarikan yang dapat diproses melalui prototype ini.</p></section>
 <div class="quick-actions"><a href="dashboard.html">Kembali ke dashboard</a><a href="README.md">Dokumentasi proyek</a></div>
 `;
}
