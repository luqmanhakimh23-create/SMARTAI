/* Halaman Settings */
if (initShell()) {
  var d = getData();
  setText('c-members', d.members.length);
  setText('c-accounts', d.accounts.length);
  setText('c-comm', d.commissions.length);

  document.getElementById('btn-reset').addEventListener('click', function () {
    confirmDialog({ title: 'Reset data demo?', message: 'Semua perubahan akan hilang dan data kembali ke default demo.', confirmText: 'Reset data' },
      function () { resetData(); });
  });
  hydrateIcons();
}
