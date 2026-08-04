// ProductTable — Inventory data table with filters & pagination

window.ProductTable = function ProductTable({ products, categories, searchTerm, setSearchTerm, onOpenAddModal, onOpenEditModal, onOpenStockModal, onConfirmDelete, userRole }) {
  const { useState, useEffect, useMemo } = React;
  const utils = window.InventoryUtils;
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = utils.matchProductSearch(p, searchTerm);
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

      const stock = Number(p.stock);
      let matchesStatus = true;
      if (selectedStatus === 'AMAN') matchesStatus = stock > 5;
      else if (selectedStatus === 'MENIPIS') matchesStatus = stock > 0 && stock <= 5;
      else if (selectedStatus === 'HABIS') matchesStatus = stock <= 0;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedStatus, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Daftar Item & Inventory Barang</h2>
          <p className="text-xs text-slate-400">Tabel katalog barang toko komputer (Teks memanjang tanpa wrap)</p>
        </div>
        {userRole === 'admin' && (
          <button onClick={onOpenAddModal} className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow shrink-0 hover:bg-blue-500 transition-all active:scale-95">
            + Tambah Barang Baru
          </button>
        )}
      </div>

      <div className="pos-card p-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Cari SKU / Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs glass-input"
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-1.5 rounded-xl text-xs glass-input">
            <option value="ALL">Semua Kategori ({categories.length})</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-1.5 rounded-xl text-xs glass-input">
            <option value="ALL">Semua Status Stok</option>
            <option value="AMAN">Stok Aman (&gt;5)</option>
            <option value="MENIPIS">Stok Menipis (1-5)</option>
            <option value="HABIS">Stok Habis (0)</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="pos-card rounded-2xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs custom-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold uppercase">
                <th className="p-3.5">Kode SKU</th>
                <th className="p-3.5">Nama Barang / Model Lengkap</th>
                <th className="p-3.5">Merk</th>
                <th className="p-3.5">Kategori Hardware</th>
                <th className="p-3.5 text-right">Harga Beli (Modal)</th>
                <th className="p-3.5 text-right">Harga Jual (Konsumen)</th>
                <th className="p-3.5 text-center">Stok Fisik</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Lokasi Rak / Gudang</th>
                <th className="p-3.5 text-center">Kelola Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-400">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              ) :
                paginatedProducts.map(p => {
                  const status = utils.getStockStatus(p.stock);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-mono-code font-bold text-blue-400">{p.sku}</td>
                      <td className="p-3.5 font-semibold text-slate-100">{p.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {p.brand}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{p.category}</td>
                      <td className="p-3.5 text-right font-mono-code text-slate-400">{utils.formatRupiah(p.buyPrice)}</td>
                      <td className="p-3.5 text-right font-mono-code font-bold text-emerald-400">{utils.formatRupiah(p.sellPrice)}</td>
                      <td className="p-3.5 text-center font-mono-code font-bold text-white text-sm">{p.stock} pcs</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${status.type === 'aman' ? 'badge-aman' : status.type === 'menipis' ? 'badge-menipis' : 'badge-habis'
                          }`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                          📍 {p.location || 'Gudang Utama'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex justify-center items-center gap-1.5">
                          <button onClick={() => onOpenStockModal(p.id, 'MASUK')} className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300" title="Restock / Jual">🔄</button>
                          {userRole === 'admin' && (
                            <>
                              <button onClick={() => onOpenEditModal(p)} className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-300" title="Edit Produk">✏️</button>
                              <button onClick={() => onConfirmDelete(p)} className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300" title="Hapus Produk">🗑️</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-2">
          <span className="text-[11px] text-slate-400">
            Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} dari {filteredProducts.length} produk
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 active:scale-95"
            >
              ‹ Prev
            </button>

            {getPageNumbers().map((pg, idx) =>
              pg === '...'
                ? <span key={`e${idx}`} className="px-1 text-slate-500 text-xs select-none">…</span>
                : <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold border transition-all active:scale-95 ${currentPage === pg
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                  {pg}
                </button>
            )}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 active:scale-95"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
