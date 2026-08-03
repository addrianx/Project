// Stock Transaction Modal Component (Form Restock / Sale)

window.StockModal = function({
  isOpen,
  onClose,
  onSaveTransaction,
  products,
  initialProductId = null,
  initialType = 'MASUK'
}) {
  if (!isOpen) return null;

  const utils = window.InventoryUtils;

  const [selectedProductId, setSelectedProductId] = React.useState(initialProductId || (products[0]?.id || ''));
  const [type, setType] = React.useState(initialType || 'MASUK');
  const [quantity, setQuantity] = React.useState(1);
  const [reference, setReference] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState({});

  // Sync selected product if initialProductId changes
  React.useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
    if (initialType) setType(initialType);
    setQuantity(1);
    setReference('');
    setNotes('');
    setErrors({});
  }, [initialProductId, initialType, isOpen]);

  const targetProduct = products.find(p => p.id === selectedProductId);
  const currentStock = targetProduct ? Number(targetProduct.stock) : 0;
  
  // Calculate new stock preview
  const qtyNum = Number(quantity) || 0;
  const newStock = type === 'MASUK' ? currentStock + qtyNum : currentStock - qtyNum;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!selectedProductId) newErrors.product = 'Pilih produk terlebih dahulu';
    if (!quantity || qtyNum <= 0) newErrors.quantity = 'Jumlah harus lebih besar dari 0';
    if (type === 'KELUAR' && qtyNum > currentStock) {
      newErrors.quantity = `Stok tidak mencukupi! Stok saat ini hanya ${currentStock} pcs.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const unitPrice = type === 'MASUK' ? (targetProduct.buyPrice || 0) : (targetProduct.sellPrice || 0);

    onSaveTransaction({
      productId: targetProduct.id,
      productSku: targetProduct.sku,
      productName: targetProduct.name,
      type: type,
      quantity: qtyNum,
      unitPrice: unitPrice,
      totalPrice: unitPrice * qtyNum,
      reference: reference.trim() || (type === 'MASUK' ? 'Restock Supplier' : 'Penjualan Toko'),
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg ${
              type === 'MASUK' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {type === 'MASUK' ? '📥' : '📤'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                Pencatatan Transaksi Stok {type === 'MASUK' ? 'Masuk (Restock)' : 'Keluar (Penjualan)'}
              </h3>
              <p className="text-xs text-slate-400">Update jumlah fisik barang di toko secara real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Transaction Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Jenis Transaksi Stok
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('MASUK')}
                className={`py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                  type === 'MASUK'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>📥 Barang Masuk (Restock)</span>
              </button>
              <button
                type="button"
                onClick={() => setType('KELUAR')}
                className={`py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                  type === 'KELUAR'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>📤 Barang Keluar (Penjualan)</span>
              </button>
            </div>
          </div>

          {/* Product Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pilih Barang Komputer <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm glass-input cursor-pointer"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.name} - (Stok: {p.stock} pcs)
                </option>
              ))}
            </select>
            {errors.product && <p className="text-xs text-rose-400 mt-1">{errors.product}</p>}
          </div>

          {/* Quantity Input & Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jumlah (Pcs) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full px-3 py-2 rounded-xl text-sm font-mono-code glass-input"
              />
              {errors.quantity && <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>}
            </div>

            {/* Live Stock Preview */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-center text-xs">
              <span className="text-slate-400">Preview Perubahan Stok:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-300 font-mono-code">{currentStock} pcs</span>
                <span className="text-slate-500">➔</span>
                <span className={`font-extrabold font-mono-code text-sm ${
                  newStock < 0 ? 'text-rose-400' : newStock <= 5 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {newStock} pcs
                </span>
              </div>
            </div>
          </div>

          {/* Reference / Invoice / Supplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              No. Referensi / Invoice / Supplier
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={type === 'MASUK' ? 'Contoh: PO-SUP-2026-08 (PT Nusantara)' : 'Contoh: INV-2026-0803-01'}
              className="w-full px-3 py-2 rounded-xl text-sm glass-input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Transaksi
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              placeholder="Contoh: Restock mingguan / Penjualan paket rakitan PC"
              className="w-full px-3 py-2 rounded-xl text-sm glass-input"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-700/60 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold glass-card hover:bg-slate-800 text-slate-300 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
                type === 'MASUK'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              }`}
            >
              Proses Transaksi {type}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
