// POSCatalogView — Main POS catalog grid with category filter & pagination

window.POSCatalogView = function POSCatalogView({
  products,
  categories,
  searchTerm,
  setSearchTerm,
  onOpenStockModal
}) {
  const { useState, useEffect, useMemo } = React;
  const utils = window.InventoryUtils;
  const CATEGORY_ICONS = window.CATEGORY_ICONS;
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCat === 'ALL' || p.category === selectedCat;
      const matchesSearch = utils.matchProductSearch(p, searchTerm);
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCat, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [selectedCat, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="space-y-4 pb-6">

      {/* Android Category Horizontal Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedCat('ALL')}
          className={`category-chip px-3.5 py-1.5 rounded-full text-xs font-semibold border ${selectedCat === 'ALL'
            ? 'active'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
        >
          🏷️ Semua ({products.length})
        </button>
        {categories.map(cat => {
          const icon = CATEGORY_ICONS[cat] || '📦';
          const count = products.filter(p => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`category-chip px-3.5 py-1.5 rounded-full text-xs font-semibold border ${selectedCat === cat
                ? 'active'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
            >
              <span>{icon} {cat} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Info hasil & halaman */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] text-slate-400">
          {filtered.length === 0
            ? 'Tidak ada produk'
            : `Menampilkan ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} dari ${filtered.length} produk`
          }
        </span>
        <span className="text-[11px] text-slate-400 font-semibold">
          Hal. {currentPage} / {totalPages}
        </span>
      </div>

      {/* Product Cards POS Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {paginated.length === 0 ? (
          <div className="col-span-full pos-card p-10 text-center space-y-2 text-slate-400">
            <div className="text-4xl">🔍</div>
            <p className="font-semibold text-slate-200 text-sm">Tidak ada produk komputer ditemukan</p>
            <p className="text-xs">Coba ganti filter kategori atau kata kunci pencarian.</p>
          </div>
        ) : (
          paginated.map(product => {
            const status = utils.getStockStatus(product.stock);
            const icon = CATEGORY_ICONS[product.category] || '💻';

            return (
              <div key={product.id} className="pos-card p-3.5 flex flex-col justify-between space-y-3">

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                        {icon}
                      </span>
                      <div>
                        <span className="font-mono-code font-bold text-[11px] text-blue-400 block">
                          {product.sku}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                          {product.brand}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${status.type === 'aman' ? 'badge-aman' : status.type === 'menipis' ? 'badge-menipis' : 'badge-habis'
                      }`}>
                      {product.stock} pcs ({status.label})
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-100 leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">📍 {product.location || 'Gudang Utama'}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-400">Harga Jual:</span>
                    <span className="font-bold font-mono-code text-sm text-emerald-400">
                      {utils.formatRupiah(product.sellPrice)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenStockModal(product.id, 'MASUK')}
                      className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span>📥</span> Restock
                    </button>
                    <button
                      onClick={() => onOpenStockModal(product.id, 'KELUAR')}
                      className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span>📤</span> Jual
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
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
      )}

    </div>
  );
};
