// TransactionHistory — Stock transaction log table

window.TransactionHistory = function TransactionHistory({ transactions, onOpenStockModal, onConfirmDelete, userRole }) {
  const utils = window.InventoryUtils;
  return (
    <div className="space-y-4 pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Riwayat Transaksi Stok</h2>
        <div className="flex gap-2">
          <button onClick={() => onOpenStockModal(null, 'MASUK')} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white">📥 Masuk</button>
          <button onClick={() => onOpenStockModal(null, 'KELUAR')} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white">📤 Keluar</button>
        </div>
      </div>

      <div className="pos-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs custom-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold uppercase">
                <th className="p-3">Waktu</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Nama Barang</th>
                <th className="p-3 text-center">Tipe</th>
                <th className="p-3 text-center">Jumlah</th>
                <th className="p-3">Total (Rp)</th>
                <th className="p-3">Referensi</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono-code text-[11px] text-slate-400">{utils.formatDate(t.timestamp, true)}</td>
                  <td className="p-3 font-mono-code text-blue-400 font-bold">{t.productSku}</td>
                  <td className="p-3 font-medium text-slate-100">{t.productName}</td>
                  <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === 'MASUK' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>{t.type}</span></td>
                  <td className="p-3 text-center font-bold font-mono-code">{t.type === 'MASUK' ? '+' : '-'}{t.quantity} pcs</td>
                  <td className="p-3 text-right font-mono-code font-bold text-slate-100">{utils.formatRupiah(t.totalPrice)}</td>
                  <td className="p-3 text-slate-300">{t.reference || '-'}</td>
                  <td className="p-3 text-center">
                    {userRole === 'admin' && (
                      <button
                        onClick={() => onConfirmDelete(t)}
                        className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition-all active:scale-95"
                      >🗑️ Hapus</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
