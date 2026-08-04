// ReportView — Inventory summary report with CSV export

window.ReportView = function ReportView({ products, categories }) {
  const utils = window.InventoryUtils;
  const stats = utils.calculateStats(products);

  const handleExportCSV = () => {
    const exportRows = products.map((p, idx) => ({
      'No': idx + 1,
      'SKU': p.sku,
      'Nama Barang': p.name,
      'Kategori': p.category,
      'Merk': p.brand,
      'Harga Beli': p.buyPrice,
      'Harga Jual': p.sellPrice,
      'Stok': p.stock,
      'Nilai Aset': p.buyPrice * p.stock,
      'Lokasi': p.location || '-'
    }));
    utils.exportToCSV(`Laporan_POS_${new Date().toISOString().split('T')[0]}.csv`, exportRows);
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Laporan Inventaris</h2>
        <button onClick={handleExportCSV} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow">📥 Export CSV</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="pos-card p-4">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Modal Aset</span>
          <div className="text-lg font-bold text-emerald-400 font-mono-code">{utils.formatRupiah(stats.totalAssetValue)}</div>
        </div>
        <div className="pos-card p-4">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Potensi Omset</span>
          <div className="text-lg font-bold text-blue-400 font-mono-code">{utils.formatRupiah(stats.totalRevenuePotential)}</div>
        </div>
        <div className="pos-card p-4">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Margin Profit</span>
          <div className="text-lg font-bold text-cyan-300 font-mono-code">+{utils.formatRupiah(stats.expectedProfit)}</div>
        </div>
        <div className="pos-card p-4">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Unit</span>
          <div className="text-lg font-bold text-white font-mono-code">{stats.totalStockUnits} pcs</div>
        </div>
      </div>
    </div>
  );
};
