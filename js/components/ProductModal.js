// ProductModal — Add / Edit product form modal

window.ProductModal = function ProductModal({ isOpen, onClose, onSave, categories, initialData }) {
  const { useState, useEffect } = React;
  if (!isOpen) return null;
  const isEdit = Boolean(initialData && initialData.id);
  const utils = window.InventoryUtils;

  const [formData, setFormData] = useState({
    sku: initialData?.sku || '',
    name: initialData?.name || '',
    category: initialData?.category || categories[0] || 'Processor',
    brand: initialData?.brand || '',
    buyPrice: initialData?.buyPrice || '',
    sellPrice: initialData?.sellPrice || '',
    stock: initialData?.stock !== undefined ? initialData.stock : '',
    location: initialData?.location || 'Rak A1'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        name: initialData.name || '',
        category: initialData.category || categories[0] || 'Processor',
        brand: initialData.brand || '',
        buyPrice: initialData.buyPrice || '',
        sellPrice: initialData.sellPrice || '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        location: initialData.location || 'Rak A1'
      });
    } else {
      setFormData({
        sku: utils.generateSKU('CPU', 'INT'),
        name: '',
        category: categories[0] || 'Processor',
        brand: '',
        buyPrice: '',
        sellPrice: '',
        stock: 10,
        location: 'Rak A1'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim()) return;
    onSave({
      ...(initialData || {}),
      sku: formData.sku.trim().toUpperCase(),
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      buyPrice: Number(formData.buyPrice),
      sellPrice: Number(formData.sellPrice),
      stock: Number(formData.stock),
      location: formData.location.trim() || 'Gudang Utama'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in overflow-y-auto">
      <div className="pos-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h3 className="font-bold text-sm text-white">{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">SKU *</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-1.5 rounded-xl text-xs font-mono-code glass-input" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Kategori *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-1.5 rounded-xl text-xs glass-input">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Barang Lengkap *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-1.5 rounded-xl text-xs glass-input" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Merk / Produsen *</label>
              <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-1.5 rounded-xl text-xs glass-input" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Lokasi Rak</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-1.5 rounded-xl text-xs glass-input" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Harga Beli</label>
              <input type="number" value={formData.buyPrice} onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })} className="w-full px-2 py-1.5 rounded-xl text-xs font-mono-code glass-input" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Harga Jual</label>
              <input type="number" value={formData.sellPrice} onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })} className="w-full px-2 py-1.5 rounded-xl text-xs font-mono-code glass-input" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stok (Pcs)</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-2 py-1.5 rounded-xl text-xs font-mono-code glass-input" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300">Batal</button>
            <button type="submit" className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};
