// AdminPasswordModal — Password verification modal for admin-only actions (backup/restore/reset)

window.AdminPasswordModal = function AdminPasswordModal({ isOpen, onClose, onConfirm, title, description, authUser }) {
  const { useState, useEffect } = React;
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!authUser || !authUser.password) {
      setErrorMsg('Sesi admin tidak valid. Silakan login kembali.');
      return;
    }

    if (passwordInput !== authUser.password) {
      setErrorMsg('⚠️ Password Admin salah! Akses ditolak.');
      return;
    }

    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="pos-card w-full max-w-sm rounded-2xl p-5 space-y-4 text-center border border-slate-800 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl mx-auto shadow">
          🔒
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-sm text-white">{title || 'Konfirmasi Password Admin'}</h3>
          <p className="text-xs text-slate-400">{description || 'Masukkan password akun Admin Anda untuk melanjutkan.'}</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-left font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            required
            autoFocus
            placeholder="Masukkan Password Admin..."
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setErrorMsg(''); }}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input focus:ring-2 focus:ring-amber-500 text-center font-mono"
          />

          <div className="flex justify-center gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">Batal</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition-all">Verifikasi &amp; Lanjutkan</button>
          </div>
        </form>
      </div>
    </div>
  );
};
