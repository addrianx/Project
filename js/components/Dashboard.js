// Dashboard Component

window.Dashboard = function({ 
  products, 
  transactions, 
  onOpenStockModal, 
  onNavigateTab,
  onOpenAddModal
}) {
  const utils = window.InventoryUtils;
  const stats = utils.calculateStats(products);

  // Filter low stock (< 5) or out of stock (= 0)
  const lowStockProducts = products.filter(p => Number(p.stock) <= 5);

  // Category distribution calculation
  const categoryStats = React.useMemo(() => {
    const map = {};
    products.forEach(p => {
      const cat = p.category || 'Lainnya';
      if (!map[cat]) {
        map[cat] = { count: 0, stock: 0, assetValue: 0 };
      }
      map[cat].count += 1;
      map[cat].stock += Number(p.stock) || 0;
      map[cat].assetValue += (Number(p.buyPrice) || 0) * (Number(p.stock) || 0);
    });

    return Object.keys(map).map(cat => ({
      category: cat,
      ...map[cat]
    })).sort((a, b) => b.assetValue - a.assetValue);
  }, [products]);

  // 5 Latest transactions
  const recentTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Ringkasan Dashboard</span>
          </h2>
          <p className="text-sm text-slate-400">Pantau performa inventaris, total nilai aset, dan alert stok toko komputer Anda.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2 rounded-xl text-sm font-semibold glass-card hover:bg-slate-800 text-slate-200 transition-all"
          >
            Lihat Semua Produk ({products.length})
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Jenis & Unit */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Jenis Barang</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
              📦
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white font-mono-code">
              {stats.totalItemTypes}
              <span className="text-sm font-normal text-slate-400 ml-1">Katalog</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total fisik: <strong className="text-slate-200">{utils.formatNumber(stats.totalStockUnits)} unit</strong>
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Card 2: Total Nilai Aset */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Nilai Aset</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              💰
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono-code tracking-tight">
              {utils.formatRupiah(stats.totalAssetValue)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Modal terikat (Harga Beli × Stok)</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Card 3: Potensi Penjualan & Margin */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Potensi Omset & Profit</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg">
              📈
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cyan-300 font-mono-code tracking-tight">
              {utils.formatRupiah(stats.totalRevenuePotential)}
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              Estimasi Margin: +{utils.formatRupiah(stats.expectedProfit)}
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Card 4: Stok Menipis & Habis */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Low Stock Alert (&lt;5)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg animate-pulse">
              ⚠️
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-400 font-mono-code">
              {stats.lowStockCount}
              <span className="text-sm font-normal text-slate-400 ml-1">Produk</span>
            </div>
            <p className="text-xs text-rose-400 mt-1">
              Habis total: <strong className="font-semibold">{stats.outOfStockCount} item</strong> (Perlu Restock!)
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Low Stock Alert Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-bold text-base text-white">Daftar Produk Stok Menipis & Habis</h3>
                <p className="text-xs text-slate-400">Produk dengan stok &lt; 5 pcs yang memerlukan pembaharuan stok segera.</p>
              </div>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {lowStockProducts.length} Perhatian
              </span>
            )}
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
              <div className="text-3xl">🎉</div>
              <h4 className="font-semibold text-slate-200">Semua Stok Produk Aman!</h4>
              <p className="text-xs text-slate-400">Tidak ada produk yang memiliki stok di bawah 5 pcs saat ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs custom-table">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Kode SKU</th>
                    <th className="p-3">Nama Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Stok</th>
                    <th className="p-3">Lokasi Rak</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {lowStockProducts.map(product => {
                    const status = utils.getStockStatus(product.stock);
                    return (
                      <tr key={product.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono-code text-blue-400 font-semibold">{product.sku}</td>
                        <td className="p-3 font-medium text-slate-200">
                          {product.name}
                          <span className="block text-[11px] text-slate-400">{product.brand}</span>
                        </td>
                        <td className="p-3 text-slate-300">{product.category}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                            status.type === 'habis' ? 'badge-habis' : 'badge-menipis'
                          }`}>
                            {product.stock} pcs ({status.label})
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{product.location}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onOpenStockModal(product.id, 'MASUK')}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-500 text-white transition-all shadow"
                          >
                            + Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Category Distribution & Recent Activity */}
        <div className="space-y-6">
          
          {/* Category Distribution */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>🏷️</span>
                <span>Nilai Stok Per Kategori</span>
              </h3>
            </div>

            <div className="space-y-3">
              {categoryStats.map(item => {
                const percentage = stats.totalAssetValue > 0 
                  ? Math.round((item.assetValue / stats.totalAssetValue) * 100) 
                  : 0;

                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{item.category} ({item.count})</span>
                      <span className="text-emerald-400 font-mono-code">
                        {utils.formatRupiah(item.assetValue)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>⚡</span>
                <span>Aktivitas Stok Terbaru</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('transactions')}
                className="text-xs text-blue-400 hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">Belum ada riwayat transaksi stok.</p>
              ) : (
                recentTransactions.map(trx => (
                  <div key={trx.id} className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          trx.type === 'MASUK' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {trx.type}
                        </span>
                        <span className="truncate max-w-[140px]" title={trx.productName}>
                          {trx.productName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{trx.notes || trx.reference || '-'}</p>
                    </div>

                    <div className="text-right">
                      <div className={`font-bold font-mono-code ${trx.type === 'MASUK' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {trx.type === 'MASUK' ? '+' : '-'}{trx.quantity} pcs
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {utils.formatDate(trx.timestamp, true)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
