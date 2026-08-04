// StockModal — Multi-item stock transaction modal with cart & custom item mode

window.StockModal = function StockModal({ isOpen, onClose, onSaveTransactionsBatch, products, initialProductId, initialType }) {
  const { useState, useEffect, useMemo } = React;
  if (!isOpen) return null;
  const utils = window.InventoryUtils;

  const [type, setType] = useState(initialType || 'MASUK');
  const [inputMode, setInputMode] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || (products[0]?.id || ''));
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState('');
  const [cart, setCart] = useState([]);

  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customQty, setCustomQty] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter(p => utils.matchProductSearch(p, searchQuery));
  }, [products, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      const initId = initialProductId || (products[0]?.id || '');
      setSelectedProductId(initId);
      if (initialType) setType(initialType);
      setQuantity(1);
      setSearchQuery('');
      setCart([]);
      setInputMode('inventory');
      setCustomName('');
      setCustomPrice('');
      setCustomQty(1);
    }
  }, [isOpen, initialProductId, initialType]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const isStillIn = filteredProducts.some(p => p.id === selectedProductId);
      if (!isStillIn) {
        setSelectedProductId(filteredProducts[0].id);
      }
    }
  }, [filteredProducts, searchQuery]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || filteredProducts[0] || products[0];
  const currentStock = selectedProduct ? Number(selectedProduct.stock) : 0;
  const qtyNum = Number(quantity) || 0;
  const newStock = type === 'MASUK' ? currentStock + qtyNum : Math.max(0, currentStock - qtyNum);

  const handleAddToCart = () => {
    if (!selectedProduct || qtyNum <= 0) return;

    if (type === 'KELUAR') {
      const inCartQty = cart
        .filter(item => item.product && item.product.id === selectedProduct.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (inCartQty + qtyNum > currentStock) {
        alert(`Stok tidak cukup! Stok tersedia: ${currentStock} pcs, Sudah di keranjang: ${inCartQty} pcs.`);
        return;
      }
    }

    const unitPrice = type === 'MASUK' ? (selectedProduct.buyPrice || 0) : (selectedProduct.sellPrice || 0);

    setCart(prev => {
      const existingIdx = prev.findIndex(i => i.product && i.product.id === selectedProduct.id && i.type === type && !i.isCustom);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const old = updated[existingIdx];
        const updatedQty = old.quantity + qtyNum;
        updated[existingIdx] = { ...old, quantity: updatedQty, totalPrice: old.unitPrice * updatedQty };
        return updated;
      } else {
        return [...prev, {
          product: selectedProduct,
          quantity: qtyNum,
          unitPrice: unitPrice,
          totalPrice: unitPrice * qtyNum,
          type: type,
          isCustom: false
        }];
      }
    });
    setQuantity(1);
  };

  const handleAddCustomToCart = () => {
    const trimmedName = customName.trim();
    const priceNum = Number(customPrice) || 0;
    const qtyC = Number(customQty) || 0;

    if (!trimmedName) { alert('Nama item tidak boleh kosong.'); return; }
    if (priceNum <= 0) { alert('Harga jual harus lebih dari 0.'); return; }
    if (qtyC <= 0) { alert('Jumlah harus lebih dari 0.'); return; }

    setCart(prev => [...prev, {
      product: null,
      customName: trimmedName,
      quantity: qtyC,
      unitPrice: priceNum,
      totalPrice: priceNum * qtyC,
      type: 'KELUAR',
      isCustom: true
    }]);

    setCustomName('');
    setCustomPrice('');
    setCustomQty(1);
  };

  const handleRemoveFromCart = (index) => {
    const item = cart[index];
    if (!item) return;
    const label = item.isCustom ? item.customName : item.product.name;
    if (window.confirm(`Hapus barang "${label}" dari keranjang transaksi?`)) {
      setCart(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let itemsToProcess = [];

    if (cart.length > 0) {
      itemsToProcess = cart.map(item => {
        if (item.isCustom) {
          return {
            productId: 'CUSTOM-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            productSku: '[ITEM BEBAS]',
            productName: item.customName,
            type: 'KELUAR',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            reference: reference.trim() || 'Penjualan Item Bebas',
            isCustomItem: true,
            timestamp: new Date().toISOString()
          };
        }
        return {
          productId: item.product.id,
          productSku: item.product.sku,
          productName: item.product.name,
          type: item.type,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          reference: reference.trim() || (item.type === 'MASUK' ? 'Restock Supplier (Multi)' : 'Penjualan Toko (Multi)'),
          timestamp: new Date().toISOString()
        };
      });
    } else {
      if (inputMode === 'custom') {
        const trimmedName = customName.trim();
        const priceNum = Number(customPrice) || 0;
        const qtyC = Number(customQty) || 0;
        if (!trimmedName) { alert('Nama item tidak boleh kosong.'); return; }
        if (priceNum <= 0) { alert('Harga jual harus lebih dari 0.'); return; }
        if (qtyC <= 0) { alert('Jumlah harus lebih dari 0.'); return; }
        itemsToProcess = [{
          productId: 'CUSTOM-' + Date.now(),
          productSku: '[ITEM BEBAS]',
          productName: trimmedName,
          type: 'KELUAR',
          quantity: qtyC,
          unitPrice: priceNum,
          totalPrice: priceNum * qtyC,
          reference: reference.trim() || 'Penjualan Item Bebas',
          isCustomItem: true,
          timestamp: new Date().toISOString()
        }];
      } else {
        if (!selectedProduct || qtyNum <= 0) return;
        if (type === 'KELUAR' && qtyNum > currentStock) {
          alert(`Stok tidak cukup! Stok tersedia: ${currentStock} pcs.`);
          return;
        }
        const unitPrice = type === 'MASUK' ? (selectedProduct.buyPrice || 0) : (selectedProduct.sellPrice || 0);
        itemsToProcess = [{
          productId: selectedProduct.id,
          productSku: selectedProduct.sku,
          productName: selectedProduct.name,
          type: type,
          quantity: qtyNum,
          unitPrice: unitPrice,
          totalPrice: unitPrice * qtyNum,
          reference: reference.trim() || (type === 'MASUK' ? 'Restock Supplier' : 'Penjualan Toko'),
          timestamp: new Date().toISOString()
        }];
      }
    }

    onSaveTransactionsBatch(itemsToProcess);
    onClose();
  };

  const cartGrandTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartTotalPcs = cart.reduce((sum, item) => sum + item.quantity, 0);
  const customSingleTotal = (Number(customPrice) || 0) * (Number(customQty) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="pos-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <span>{type === 'MASUK' ? '📥' : '📤'}</span>
            <span>Transaksi Stok {type === 'MASUK' ? 'Masuk (Restock)' : 'Keluar (Penjualan)'}</span>
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Tipe Transaksi */}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setType('MASUK'); setCart([]); setInputMode('inventory'); }}
              className={`py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${type === 'MASUK' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}>
              <span>📥</span> Restock (Masuk)
            </button>
            <button type="button" onClick={() => { setType('KELUAR'); setCart([]); }}
              className={`py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${type === 'KELUAR' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}>
              <span>📤</span> Penjualan (Keluar)
            </button>
          </div>

          {/* Sub-mode (hanya KELUAR) */}
          {type === 'KELUAR' && (
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
              <button type="button" onClick={() => setInputMode('inventory')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${inputMode === 'inventory' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                📦 Dari Inventory
              </button>
              <button type="button" onClick={() => setInputMode('custom')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${inputMode === 'custom' ? 'bg-amber-500 text-white shadow shadow-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}>
                ✍️ Item Bebas
              </button>
            </div>
          )}

          {/* Mode Inventory */}
          {(type === 'MASUK' || inputMode === 'inventory') && (
            <>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-semibold text-slate-300">Cari Barang (ID / SKU / Nama) *</label>
                  <span className="text-[10px] text-slate-400 font-mono">{filteredProducts.length} barang ditemukan</span>
                </div>
                <div className="relative">
                  <input type="text" placeholder="Contoh: prod-001, VGA, RAM..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 rounded-xl text-xs glass-input" />
                  <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-white">✕</button>
                  )}
                </div>
              </div>

              <div>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs glass-input">
                  {filteredProducts.length === 0
                    ? <option value="" disabled>Tidak ada barang yang cocok</option>
                    : filteredProducts.map(p => (
                      <option key={p.id} value={p.id}>[{p.sku}] {p.name} (Stok: {p.stock} pcs)</option>
                    ))
                  }
                </select>
              </div>

              {selectedProduct && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code font-bold text-[11px] text-blue-400">{selectedProduct.sku}</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">{selectedProduct.id}</span>
                      </div>
                      <p className="font-bold text-xs text-white leading-snug mt-1">{selectedProduct.name}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold shrink-0">{selectedProduct.brand}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
                    <span className="text-slate-400">Stok: <strong className="text-white">{currentStock} pcs</strong></span>
                    <span className="font-mono-code text-emerald-400 font-bold">
                      {utils.formatRupiah(type === 'MASUK' ? selectedProduct.buyPrice : selectedProduct.sellPrice)} / pcs
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Jumlah Pcs *</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1"
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono-code glass-input" />
                </div>
                <button type="button" onClick={handleAddToCart} disabled={!selectedProduct || qtyNum <= 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shrink-0 flex items-center gap-1 shadow disabled:opacity-40">
                  <span>➕</span><span>Tambah ke Keranjang</span>
                </button>
              </div>
            </>
          )}

          {/* Mode Item Bebas */}
          {type === 'KELUAR' && inputMode === 'custom' && (
            <div className="space-y-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-amber-400 text-sm">✍️</span>
                <div>
                  <p className="text-xs font-bold text-amber-300">Mode Item Bebas</p>
                  <p className="text-[10px] text-slate-400 leading-snug">Penjualan item yang tidak terdaftar di inventory.</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Item *</label>
                <input type="text" placeholder="Contoh: Jasa Instalasi Windows..."
                  value={customName} onChange={e => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Harga Jual (Rp) *</label>
                  <input type="number" placeholder="0" value={customPrice} onChange={e => setCustomPrice(e.target.value)} min="0"
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono-code glass-input" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Jumlah *</label>
                  <input type="number" value={customQty} onChange={e => setCustomQty(e.target.value)} min="1"
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono-code glass-input" />
                </div>
              </div>

              {customSingleTotal > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                  <span className="text-slate-400">Subtotal item ini:</span>
                  <span className="font-bold text-amber-300 font-mono-code">{utils.formatRupiah(customSingleTotal)}</span>
                </div>
              )}

              <button type="button" onClick={handleAddCustomToCart}
                className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow shadow-amber-500/30">
                <span>➕</span><span>Tambah Item Bebas ke Keranjang</span>
              </button>
            </div>
          )}

          {/* Keranjang */}
          {cart.length > 0 && (
            <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <span>🛒</span> Keranjang ({cart.length} Item / {cartTotalPcs} Pcs)
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono-code">{utils.formatRupiah(cartGrandTotal)}</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-xs ${item.isCustom ? 'bg-amber-500/5 border-amber-500/25' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {item.isCustom && <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">BEBAS</span>}
                        <p className="font-semibold text-slate-200 truncate">{item.isCustom ? item.customName : item.product.name}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{item.quantity} pcs x {utils.formatRupiah(item.unitPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-emerald-400 font-mono-code text-[11px]">{utils.formatRupiah(item.totalPrice)}</span>
                      <button type="button" onClick={() => handleRemoveFromCart(idx)}
                        className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs flex items-center justify-center">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referensi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">No. Referensi / Supplier / Customer</label>
            <input type="text"
              placeholder={type === 'MASUK' ? 'Contoh: PO-SUP-2026-001' : 'Contoh: INV-2026-0803'}
              value={reference} onChange={(e) => setReference(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs glass-input" />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <div className="text-left">
              {cart.length > 0 ? (
                <span className="text-xs font-bold text-emerald-400 block font-mono-code">Total: {utils.formatRupiah(cartGrandTotal)}</span>
              ) : inputMode === 'custom' && customSingleTotal > 0 ? (
                <span className="text-xs font-bold text-amber-300 block font-mono-code">Total: {utils.formatRupiah(customSingleTotal)}</span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  {type === 'MASUK' || inputMode === 'inventory' ? `Hasil stok: ${currentStock} ➔ ${newStock} pcs` : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">Batal</button>
              <button type="submit"
                disabled={cart.length === 0 && (inputMode === 'custom'
                  ? (!customName.trim() || !Number(customPrice) || !Number(customQty))
                  : (!selectedProduct || qtyNum <= 0)
                )}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${type === 'MASUK' ? 'bg-emerald-600 hover:bg-emerald-500' : inputMode === 'custom' ? 'bg-amber-500 hover:bg-amber-400' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {cart.length > 0 ? `Proses (${cart.length} Item)` : 'Proses Transaksi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
