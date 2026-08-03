// Product Modal Component (Form Add & Edit Product)

window.ProductModal = function({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData // null for ADD, product object for EDIT
}) {
  if (!isOpen) return null;

  const isEdit = Boolean(initialData && initialData.id);
  const utils = window.InventoryUtils;

  // Form State
  const [formData, setFormData] = React.useState({
    sku: initialData?.sku || '',
    name: initialData?.name || '',
    category: initialData?.category || categories[0] || 'Processor',
    brand: initialData?.brand || '',
    buyPrice: initialData?.buyPrice || '',
    sellPrice: initialData?.sellPrice || '',
    stock: initialData?.stock !== undefined ? initialData.stock : '',
    location: initialData?.location || 'Rak A1',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = React.useState({});

  // Reset form when modal opens or initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        name: initialData.name || '',
        category: initialData.category || categories[0] || 'Processor',
        brand: initialData.brand || '',
        buyPrice: initialData.buyPrice || '',
        sellPrice: initialData.sellPrice || '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        location: initialData.location || 'Rak A1',
        description: initialData.description || ''
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
        location: 'Rak A1',
        description: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Auto Generate SKU
  const handleGenerateSKU = () => {
    const newSku = utils.generateSKU(formData.category, formData.brand);
    setFormData(prev => ({ ...prev, sku: newSku }));
  };

  // Calculate Real-time Profit Margin
  const buyP = Number(formData.buyPrice) || 0;
  const sellP = Number(formData.sellPrice) || 0;
  const profitMargin = sellP - buyP;
  const profitPercentage = buyP > 0 ? ((profitMargin / buyP) * 100).toFixed(1) : 0;

  // Validate Form
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.sku.trim()) newErrors.sku = 'Kode SKU wajib diisi';
    if (!formData.name.trim()) newErrors.name = 'Nama barang wajib diisi';
    if (!formData.brand.trim()) newErrors.brand = 'Merk wajib diisi';
    if (formData.buyPrice === '' || Number(formData.buyPrice) < 0) newErrors.buyPrice = 'Harga beli tidak valid';
    if (formData.sellPrice === '' || Number(formData.sellPrice) < 0) newErrors.sellPrice = 'Harga jual tidak valid';
    if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Stok tidak valid';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...(initialData || {}),
      sku: formData.sku.trim().toUpperCase(),
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      buyPrice: Number(formData.buyPrice),
      sellPrice: Number(formData.sellPrice),
      stock: Number(formData.stock),
      location: formData.location.trim() || 'Gudang Utama',
      description: formData.description.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in overflow-y-auto">
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center text-white text-lg">
              {isEdit ? '✏️' : '📦'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isEdit ? 'Edit Data Produk Inventaris' : 'Tambah Produk Komputer Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit ? 'Perbarui informasi detail barang' : 'Isi formulir untuk memasukkan barang baru ke sistem'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* SKU Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kode SKU <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Contoh: CPU-INT-001"
                  className="flex-1 px-3 py-2 rounded-xl text-sm font-mono-code glass-input"
                />
                <button
                  type="button"
                  onClick={handleGenerateSKU}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0"
                  title="Generate SKU otomatis"
                >
                  🎲 Auto SKU
                </button>
              </div>
              {errors.sku && <p className="text-xs text-rose-400 mt-1">{errors.sku}</p>}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategori <span className="text-rose-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm glass-input cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Barang / Model Lengkap <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Intel Core i7-14700K 3.4GHz 20-Cores LGA1700"
                className="w-full px-3 py-2 rounded-xl text-sm glass-input"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* Brand / Merk */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Merk / Produsen <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Contoh: ASUS, Intel, Corsair"
                className="w-full px-3 py-2 rounded-xl text-sm glass-input"
              />
              {errors.brand && <p className="text-xs text-rose-400 mt-1">{errors.brand}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lokasi Rak / Gudang
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Contoh: Rak A1 - Processor"
                className="w-full px-3 py-2 rounded-xl text-sm glass-input"
              />
            </div>

            {/* Buy Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Harga Beli (Modal Rp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="buyPrice"
                value={formData.buyPrice}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 rounded-xl text-sm font-mono-code glass-input"
              />
              {errors.buyPrice && <p className="text-xs text-rose-400 mt-1">{errors.buyPrice}</p>}
            </div>

            {/* Sell Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Harga Jual (Konsumen Rp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 rounded-xl text-sm font-mono-code glass-input"
              />
              {errors.sellPrice && <p className="text-xs text-rose-400 mt-1">{errors.sellPrice}</p>}
            </div>

            {/* Initial Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jumlah Stok (Pcs) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 rounded-xl text-sm font-mono-code glass-input"
              />
              {errors.stock && <p className="text-xs text-rose-400 mt-1">{errors.stock}</p>}
            </div>

            {/* Real-time Profit Preview Box */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-center text-xs">
              <span className="text-slate-400">Estimasi Margin Keuntungan:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`font-bold font-mono-code text-sm ${profitMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {utils.formatRupiah(profitMargin)}
                </span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded font-semibold ${profitMargin >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  ({profitPercentage}%)
                </span>
              </div>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Spesifikasi Singkat / Catatan Tambahan
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Contoh: Processor 14th Gen 20 Core 28 Thread garansi resmi 3 tahun"
              className="w-full px-3 py-2 rounded-xl text-sm glass-input"
            ></textarea>
          </div>

          {/* Modal Actions */}
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
              className="px-5 py-2.5 rounded-xl text-sm font-semibold gradient-bg-primary text-white shadow-lg shadow-blue-500/30 hover:opacity-95 transition-all"
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
