// Transaction History Log Component (Barang Masuk & Keluar)

window.TransactionHistory = function({
  transactions,
  onOpenStockModal
}) {
  const utils = window.InventoryUtils;

  const [filterType, setFilterType] = React.useState('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filtered transactions
  const filtered = React.useMemo(() => {
    return transactions.filter(trx => {
      const matchesType = filterType === 'ALL' || trx.type === filterType;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query ||
        trx.productSku.toLowerCase().includes(query) ||
        trx.productName.toLowerCase().includes(query) ||
        (trx.reference && trx.reference.toLowerCase().includes(query)) ||
        (trx.notes && trx.notes.toLowerCase().includes(query));

      return matchesType && matchesSearch;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, filterType, searchTerm]);

  // Transaction summary calculations
  const summary = React.useMemo(() => {
    let totalMasukQty = 0;
    let totalMasukVal = 0;
    let totalKeluarQty = 0;
    let totalKeluarVal = 0;

    transactions.forEach(t => {
      if (t.type === 'MASUK') {
        totalMasukQty += t.quantity;
        totalMasukVal += (t.totalPrice || 0);
      } else {
        totalKeluarQty += t.quantity;
        totalKeluarVal += (t.totalPrice || 0);
      }
    });

    return { totalMasukQty, totalMasukVal, totalKeluarQty, totalKeluarVal };
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Riwayat Transaksi Stok</span>
          </h2>
          <p className="text-sm text-slate-400">Pencatatan riwayat barang masuk (supplier) & barang keluar (penjualan konsumen).</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenStockModal(null, 'MASUK')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
          >
            <span>📥 Catat Barang Masuk</span>
          </button>
          <button
            onClick={() => onOpenStockModal(null, 'KELUAR')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20"
          >
            <span>📤 Catat Barang Keluar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Barang Masuk (Restock)</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono-code mt-1">
              +{utils.formatNumber(summary.totalMasukQty)} <span className="text-xs font-normal text-slate-400">pcs</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Nilai Pembelian: {utils.formatRupiah(summary.totalMasukVal)}</p>
          </div>
          <div className="text-3xl">📥</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-blue-500 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Barang Keluar (Terjual)</span>
            <div className="text-2xl font-extrabold text-blue-400 font-mono-code mt-1">
              -{utils.formatNumber(summary.totalKeluarQty)} <span className="text-xs font-normal text-slate-400">pcs</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Nilai Penjualan: {utils.formatRupiah(summary.totalKeluarVal)}</p>
          </div>
          <div className="text-3xl">📤</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'ALL'
                ? 'bg-slate-700 text-white shadow'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('MASUK')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'MASUK'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900/60 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            📥 Barang Masuk
          </button>
          <button
            onClick={() => setFilterType('KELUAR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'KELUAR'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900/60 text-blue-400 hover:bg-slate-800'
            }`}
          >
            📤 Barang Keluar
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari transaksi (SKU / Nama / Ref)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs glass-input"
          />
          <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs custom-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="p-3.5">Waktu Transaksi</th>
                <th className="p-3.5">SKU & Barang</th>
                <th className="p-3.5 text-center">Tipe</th>
                <th className="p-3.5 text-center">Jumlah</th>
                <th className="p-3.5 text-right">Harga Satuan</th>
                <th className="p-3.5 text-right">Total Transaksi</th>
                <th className="p-3.5">Referensi / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    <div className="text-3xl mb-2">📜</div>
                    <p className="font-semibold text-slate-300">Belum ada riwayat transaksi stok.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 text-slate-400 whitespace-nowrap font-mono-code text-[11px]">
                      {utils.formatDate(trx.timestamp, true)}
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono-code text-blue-400 font-semibold">{trx.productSku}</div>
                      <div className="font-medium text-slate-200">{trx.productName}</div>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        trx.type === 'MASUK'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {trx.type === 'MASUK' ? '📥 MASUK' : '📤 KELUAR'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold font-mono-code text-sm">
                      <span className={trx.type === 'MASUK' ? 'text-emerald-400' : 'text-blue-400'}>
                        {trx.type === 'MASUK' ? '+' : '-'}{trx.quantity} pcs
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono-code text-slate-400">
                      {utils.formatRupiah(trx.unitPrice)}
                    </td>
                    <td className="p-3.5 text-right font-mono-code font-bold text-slate-100">
                      {utils.formatRupiah(trx.totalPrice)}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div className="font-medium text-slate-200">{trx.reference || '-'}</div>
                      <div className="text-[11px] text-slate-400">{trx.notes || '-'}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
