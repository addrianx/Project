// Settings & Data Management Component

window.SettingsView = function({
  onResetData,
  onAddCategory,
  categories,
  productsCount,
  transactionsCount
}) {
  const [newCat, setNewCat] = React.useState('');
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Pengaturan & Kelola Data</span>
        </h2>
        <p className="text-sm text-slate-400">Atur kategori sparepart, opsi database localstorage, dan reset data awal.</p>
      </div>

      {/* Category Management */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <span>🏷️</span> Kelola Kategori Barang Komputer
        </h3>
        
        <form onSubmit={handleAddCategorySubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="Tambah Kategori Baru (contoh: Monitor Gaming)..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-sm glass-input"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-sm font-semibold gradient-bg-primary text-white hover:opacity-90 shadow"
          >
            + Tambah Kategori
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map(cat => (
            <span key={cat} className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>{cat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Database / LocalStorage Info & Reset */}
      <div className="glass-card rounded-2xl p-6 space-y-4 border border-rose-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Reset Database & Data Dummy Awal</h3>
            <p className="text-xs text-slate-400">Kembalikan data produk dan transaksi ke data dummy komputer bawaan pabrik.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 text-slate-300">
          <div>• Total Produk Tersimpan: <strong>{productsCount} item</strong></div>
          <div>• Total Riwayat Transaksi: <strong>{transactionsCount} catatan</strong></div>
          <div>• Media Penyimpanan: <strong>LocalStorage Peramban Browser (Offline Ready)</strong></div>
        </div>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-600/80 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-600/20"
          >
            🔄 Reset Semua Data ke Dummy Realistis
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-3 animate-fade-in">
            <p className="text-xs font-bold text-rose-300">
              Apakah Anda yakin ingin menghapus semua perubahan dan mengembalikan ke data dummy awal?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 shadow"
              >
                Ya, Reset Sekarang
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
