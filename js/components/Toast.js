// Interactive Toast Notification & Confirm Delete Modal Components

window.Toast = function({ message, type, onClose }) {
  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-600 text-white shadow-emerald-600/30',
    error: 'bg-rose-600 text-white shadow-rose-600/30',
    warning: 'bg-amber-600 text-white shadow-amber-600/30',
    info: 'bg-blue-600 text-white shadow-blue-600/30'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-auto">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl font-medium text-xs border border-white/20 backdrop-blur-lg ${bgColors[type] || bgColors.info}`}>
        <span className="text-base">{icons[type] || 'ℹ️'}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 w-5 h-5 rounded-full hover:bg-black/20 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

window.DeleteConfirmModal = function({ isOpen, onClose, onConfirm, product }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl border border-rose-500/30 overflow-hidden p-6 space-y-4 text-center">
        
        <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto border border-rose-500/40 animate-pulse">
          🗑️
        </div>

        <div>
          <h3 className="font-bold text-lg text-white">Konfirmasi Hapus Produk</h3>
          <p className="text-xs text-slate-400 mt-1">Apakah Anda yakin ingin menghapus barang berikut dari database inventory?</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-left space-y-1 font-mono-code">
          <div className="text-blue-400 font-bold">[{product.sku}]</div>
          <div className="text-slate-100 font-sans font-semibold text-sm">{product.name}</div>
          <div className="text-slate-400 font-sans">Kategori: {product.category} | Stok: {product.stock} pcs</div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
          >
            Ya, Hapus Produk
          </button>
        </div>

      </div>
    </div>
  );
};
