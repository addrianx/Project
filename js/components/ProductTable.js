// Inventory Product Table Component (Full CRUD, Search, Filter & Sort)

window.ProductTable = function({
  products,
  categories,
  searchTerm,
  setSearchTerm,
  onOpenAddModal,
  onOpenEditModal,
  onOpenStockModal,
  onConfirmDelete
}) {
  const utils = window.InventoryUtils;

  // Local states for filters & sorting
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [sortField, setSortField] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState('asc');

  // Handle Sort Click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted products
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        product.sku.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      // 2. Category Filter
      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;

      // 3. Status Filter
      const stock = Number(product.stock);
      let matchesStatus = true;
      if (selectedStatus === 'AMAN') matchesStatus = stock > 5;
      else if (selectedStatus === 'MENIPIS') matchesStatus = stock > 0 && stock <= 5;
      else if (selectedStatus === 'HABIS') matchesStatus = stock <= 0;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus, sortField, sortDirection]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Title & Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Manajemen Data Inventory</span>
          </h2>
          <p className="text-sm text-slate-400">Kelola katalog barang toko komputer, harga beli/jual, stok, dan lokasi rak gudang.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-bg-primary text-white shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all active:scale-95"
          >
            <span>➕</span>
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari SKU / Nama / Merk / Rak..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm glass-input"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm glass-input cursor-pointer"
            >
              <option value="ALL">Semua Kategori ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter Status Stok */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm glass-input cursor-pointer"
            >
              <option value="ALL">Semua Status Stok</option>
              <option value="AMAN">Stok Aman (&gt; 5 pcs)</option>
              <option value="MENIPIS">Stok Menipis (1 - 5 pcs)</option>
              <option value="HABIS">Stok Habis (0 pcs)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center gap-2">
            {(searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-1"
              >
                <span>🔄</span> Reset Filter
              </button>
            )}
          </div>

        </div>

        {/* Counter Info */}
        <div className="flex justify-between items-center text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span>Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{products.length}</strong> produk</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Menipis</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Habis</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs custom-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('sku')}>
                  Kode SKU {sortField === 'sku' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  Nama Barang / Merk {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('category')}>
                  Kategori {sortField === 'category' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 text-right cursor-pointer hover:text-white" onClick={() => handleSort('buyPrice')}>
                  Harga Beli {sortField === 'buyPrice' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 text-right cursor-pointer hover:text-white" onClick={() => handleSort('sellPrice')}>
                  Harga Jual {sortField === 'sellPrice' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 text-center cursor-pointer hover:text-white" onClick={() => handleSort('stock')}>
                  Stok & Status {sortField === 'stock' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('location')}>
                  Lokasi Rak {sortField === 'location' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="p-3.5 text-center">Aksi / Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 space-y-2">
                    <div className="text-4xl">🔍</div>
                    <p className="font-semibold text-slate-300">Tidak ada data barang yang cocok.</p>
                    <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter kategori yang dipilih.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const status = utils.getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className="transition-colors hover:bg-slate-800/50">
                      
                      {/* SKU */}
                      <td className="p-3.5 font-mono-code font-bold text-blue-400">
                        {product.sku}
                      </td>

                      {/* Name & Brand */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-100 max-w-xs">{product.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                            {product.brand}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-slate-300 font-medium">
                        {product.category}
                      </td>

                      {/* Buy Price */}
                      <td className="p-3.5 text-right font-mono-code text-slate-400">
                        {utils.formatRupiah(product.buyPrice)}
                      </td>

                      {/* Sell Price */}
                      <td className="p-3.5 text-right font-mono-code font-bold text-emerald-400">
                        {utils.formatRupiah(product.sellPrice)}
                      </td>

                      {/* Stock & Status Badge */}
                      <td className="p-3.5 text-center">
                        <div className="space-y-1">
                          <span className="font-bold text-sm font-mono-code text-white">
                            {product.stock} pcs
                          </span>
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              status.type === 'aman' ? 'badge-aman' : status.type === 'menipis' ? 'badge-menipis' : 'badge-habis'
                            }`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rack Location */}
                      <td className="p-3.5 text-slate-300">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
                          <span>📍</span> {product.location || '-'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Quick Restock / Sale button */}
                          <button
                            onClick={() => onOpenStockModal(product.id, 'MASUK')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
                            title="Update Stok (Masuk/Keluar)"
                          >
                            🔄
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => onOpenEditModal(product)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all"
                            title="Edit Data Produk"
                          >
                            ✏️
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => onConfirmDelete(product)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                            title="Hapus Produk"
                          >
                            🗑️
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
