// Sidebar Navigation Component

window.Sidebar = function({ activeTab, onSelectTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: stats.lowStockCount > 0 ? stats.lowStockCount : null, badgeColor: 'bg-amber-500' },
    { id: 'inventory', label: 'Data Inventory', icon: '📦', badge: stats.totalItemTypes, badgeColor: 'bg-blue-600/60' },
    { id: 'transactions', label: 'Barang Masuk / Keluar', icon: '🔄', badge: null },
    { id: 'reports', label: 'Laporan & Export', icon: '📈', badge: null },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️', badge: null }
  ];

  return (
    <aside className="w-full lg:w-64 glass-card border-r border-slate-700/50 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Navigation Menu */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Inventory Summary Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Nilai Aset Stok:</span>
            <span className="font-semibold text-emerald-400 font-mono-code">
              {window.InventoryUtils.formatRupiah(stats.totalAssetValue)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Stok Menipis:</span>
            <span className={`font-semibold ${stats.lowStockCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {stats.lowStockCount} Produk
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Stok Habis:</span>
            <span className={`font-semibold ${stats.outOfStockCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {stats.outOfStockCount} Produk
            </span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span>V1.0 • React + Tailwind</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></span>
      </div>
    </aside>
  );
};
