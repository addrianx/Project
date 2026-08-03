// Navbar / Header Component

window.Header = function({ 
  currentTheme, 
  onToggleTheme, 
  lowStockCount, 
  onOpenAddModal, 
  onOpenStockModal,
  onNavigateTab,
  globalSearch,
  setGlobalSearch
}) {
  return (
    <header className="sticky top-0 z-30 glass-card border-b border-slate-700/50 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-xl">
              💻
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide flex items-center gap-2">
                <span>CYBER TECH</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-normal border border-blue-500/30">
                  Inventory System
                </span>
              </h1>
              <p className="text-xs text-slate-400">Toko Komputer & Accessories Hardware</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-md ml-2 hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Cari SKU, Nama Barang, Merk, atau Lokasi Rak..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                onNavigateTab('inventory');
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm glass-input placeholder-slate-400"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-3 justify-end">
          
          {/* Quick Add Product Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold gradient-bg-primary text-white hover:opacity-90 transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Tambah Produk</span>
          </button>

          {/* Quick Transaction Button */}
          <button
            onClick={() => onOpenStockModal()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold gradient-bg-accent text-white hover:opacity-90 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Update Stok</span>
          </button>

          {/* Low Stock Alert Bell Notification */}
          <button
            onClick={() => onNavigateTab('dashboard')}
            className={`relative p-2.5 rounded-xl border transition-all ${
              lowStockCount > 0 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={`${lowStockCount} Produk Stok Menipis/Habis`}
          >
            <span className="text-base">🔔</span>
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-xs rounded-full flex items-center justify-center shadow-md animate-pulse">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 text-slate-200 hover:bg-slate-700/80 transition-all active:scale-90"
            title={`Ganti ke Tema ${currentTheme === 'dark' ? 'Terang' : 'Gelap'}`}
          >
            {currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>

        </div>
      </div>
    </header>
  );
};
