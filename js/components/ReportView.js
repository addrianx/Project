// Inventory Report & CSV Export Component

window.ReportView = function({ products, categories }) {
  const utils = window.InventoryUtils;
  const stats = utils.calculateStats(products);

  // Filter by category option
  const [selectedCat, setSelectedCat] = React.useState('ALL');

  const filteredProducts = React.useMemo(() => {
    if (selectedCat === 'ALL') return products;
    return products.filter(p => p.category === selectedCat);
  }, [products, selectedCat]);

  const filteredStats = utils.calculateStats(filteredProducts);

  // Group by category for recap table
  const categoryRecap = React.useMemo(() => {
    const map = {};
    products.forEach(p => {
      const cat = p.category || 'Lainnya';
      if (!map[cat]) {
        map[cat] = { count: 0, units: 0, buyVal: 0, sellVal: 0 };
      }
      const qty = Number(p.stock) || 0;
      map[cat].count += 1;
      map[cat].units += qty;
      map[cat].buyVal += (Number(p.buyPrice) || 0) * qty;
      map[cat].sellVal += (Number(p.sellPrice) || 0) * qty;
    });

    return Object.keys(map).map(cat => ({
      category: cat,
      ...map[cat],
      margin: map[cat].sellVal - map[cat].buyVal
    })).sort((a, b) => b.buyVal - a.buyVal);
  }, [products]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const filename = `Laporan_Inventaris_Toko_Komputer_${today}.csv`;

    const exportRows = filteredProducts.map((p, idx) => ({
      'No': idx + 1,
      'Kode SKU': p.sku,
      'Nama Barang': p.name,
      'Kategori': p.category,
      'Merk': p.brand,
      'Harga Beli (Rp)': p.buyPrice,
      'Harga Jual (Rp)': p.sellPrice,
      'Stok (Pcs)': p.stock,
      'Status Stok': utils.getStockStatus(p.stock).label,
      'Total Nilai Aset (Rp)': p.buyPrice * p.stock,
      'Potensi Jual (Rp)': p.sellPrice * p.stock,
      'Lokasi Rak': p.location || '-'
    }));

    utils.exportToCSV(filename, exportRows);
  };

  // Handle Print Rekap
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Laporan & Rekapitulasi Stok</span>
          </h2>
          <p className="text-sm text-slate-400">Ringkasan nilai keuangan aset inventaris toko dan fitur cetak / export data CSV.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <span>📥 Export CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold glass-card hover:bg-slate-800 text-slate-200 transition-all border border-slate-700 active:scale-95"
          >
            <span>🖨️ Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Printable Header Title */}
      <div className="hidden print:block text-center py-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-black">LAPORAN REKAPITULASI INVENTARIS TOKO KOMPUTER</h1>
        <p className="text-sm text-gray-600">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Aset (Modal Terikat)</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono-code mt-2">
            {utils.formatRupiah(filteredStats.totalAssetValue)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Dihitung dari (Harga Beli × Stok)</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Potensi Omset Penjualan</span>
          <div className="text-2xl font-extrabold text-blue-400 font-mono-code mt-2">
            {utils.formatRupiah(filteredStats.totalRevenuePotential)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Dihitung dari (Harga Jual × Stok)</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Estimasi Total Profit</span>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono-code mt-2">
            +{utils.formatRupiah(filteredStats.expectedProfit)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Selisih Potensi Omset & Aset Modal</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Fisik Unit Barang</span>
          <div className="text-2xl font-extrabold text-white font-mono-code mt-2">
            {utils.formatNumber(filteredStats.totalStockUnits)} <span className="text-sm font-normal text-slate-400">Pcs</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Dari {filteredStats.totalItemTypes} variasi barang</p>
        </div>

      </div>

      {/* Category Rekapitulasi Table */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center no-print">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <span>📊</span>
              <span>Rekapitulasi Nilai Per Kategori</span>
            </h3>
            <p className="text-xs text-slate-400">Rincian modal aset dan estimasi pendapatan berdasarkan kelompok hardware.</p>
          </div>

          <div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs glass-input cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs custom-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold uppercase">
                <th className="p-3.5">Nama Kategori Hardware</th>
                <th className="p-3.5 text-center">Jumlah SKU</th>
                <th className="p-3.5 text-center">Total Stok (Unit)</th>
                <th className="p-3.5 text-right">Nilai Aset (Harga Beli)</th>
                <th className="p-3.5 text-right">Nilai Jual (Omset)</th>
                <th className="p-3.5 text-right">Estimasi Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {categoryRecap.map(item => (
                <tr key={item.category} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-200">{item.category}</td>
                  <td className="p-3.5 text-center text-slate-300">{item.count} jenis</td>
                  <td className="p-3.5 text-center font-bold font-mono-code text-white">{item.units} pcs</td>
                  <td className="p-3.5 text-right font-mono-code text-slate-300">{utils.formatRupiah(item.buyVal)}</td>
                  <td className="p-3.5 text-right font-mono-code font-semibold text-blue-400">{utils.formatRupiah(item.sellVal)}</td>
                  <td className="p-3.5 text-right font-mono-code font-bold text-emerald-400">+{utils.formatRupiah(item.margin)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-700 bg-slate-900/80 font-bold">
                <td className="p-3.5 text-slate-100">TOTAL REKAPITULASI</td>
                <td className="p-3.5 text-center text-slate-200">{stats.totalItemTypes} jenis</td>
                <td className="p-3.5 text-center text-white">{stats.totalStockUnits} pcs</td>
                <td className="p-3.5 text-right font-mono-code text-emerald-400">{utils.formatRupiah(stats.totalAssetValue)}</td>
                <td className="p-3.5 text-right font-mono-code text-blue-400">{utils.formatRupiah(stats.totalRevenuePotential)}</td>
                <td className="p-3.5 text-right font-mono-code text-cyan-300">+{utils.formatRupiah(stats.expectedProfit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
