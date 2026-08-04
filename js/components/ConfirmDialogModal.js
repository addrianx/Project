// ConfirmDialogModal — General-purpose confirmation modal for dangerous actions

window.ConfirmDialogModal = function ConfirmDialogModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya, Lanjutkan', confirmBg = 'bg-rose-600 hover:bg-rose-500', icon = '⚠️' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="pos-card w-full max-w-sm rounded-2xl p-5 space-y-4 text-center border border-slate-800 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-2xl mx-auto shadow">
          {icon}
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-sm text-white">{title || 'Konfirmasi Tindakan'}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{message || 'Apakah Anda yakin ingin melanjutkan tindakan ini?'}</p>
        </div>

        <div className="flex justify-center gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">Batal</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow transition-all active:scale-95 ${confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
