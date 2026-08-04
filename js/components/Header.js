// Header Component — Top navigation bar with search, notifications & user actions

window.Header = function Header({ currentTheme, onToggleTheme, lowStockCount, onOpenAddModal, onOpenStockModal, onNavigateTab, globalSearch, setGlobalSearch, stats, userRole, onToggleRole, authUser, onLogout, products }) {
  const [showNotif, setShowNotif] = React.useState(false);
  const [canInstall, setCanInstall] = React.useState(!!window.deferredPrompt);
  const notifRef = React.useRef(null);

  React.useEffect(() => {
    const handleInstallReady = () => setCanInstall(true);
    window.addEventListener('pwa-install-ready', handleInstallReady);
    return () => window.removeEventListener('pwa-install-ready', handleInstallReady);
  }, []);

  const handleInstallPWA = async () => {
    if (!window.deferredPrompt) return;
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    window.deferredPrompt = null;
  };

  // Close panel on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const lowStockItems = (products || [])
    .filter(p => p.stock <= (p.minStock || 5))
    .sort((a, b) => a.stock - b.stock);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">

        {/* Store Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/30">
            📱
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-base leading-none tracking-tight flex items-center gap-1.5 text-white">
              CIPTA POS
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                ANDROID
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Inventory &amp; Kasir Toko Komputer</p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative flex-1 max-w-md mx-1 sm:mx-2">
          <input
            type="text"
            placeholder="Cari SKU, Nama Barang, Merk..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              onNavigateTab('pos');
            }}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs glass-input placeholder-slate-400"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          {globalSearch && (
            <button onClick={() => setGlobalSearch('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">✕</button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* PWA Install Button */}
          {canInstall && (
            <button
              onClick={handleInstallPWA}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold border transition-all items-center gap-1.5 bg-indigo-600/20 text-indigo-400 border-indigo-500/40 hover:bg-indigo-600/30 shadow-[0_0_15px_rgba(79,70,229,0.2)] animate-pulse hover:animate-none"
              title="Install Aplikasi ke Perangkat (PWA)"
            >
              <span className="text-sm">⬇️</span>
              <span>Install App</span>
            </button>
          )}

          {/* Role Badge */}
          <div
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${userRole === 'admin'
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
              : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
              }`}
          >
            <span className="text-sm">{userRole === 'admin' ? '👨‍💼' : '🧑‍💻'}</span>
            <span className="capitalize font-semibold">{userRole === 'admin' ? 'Admin' : 'Kasir'}</span>
          </div>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(v => !v)}
              className={`relative p-2 rounded-xl border transition-all ${lowStockCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              title={lowStockCount > 0 ? `${lowStockCount} Stok Menipis` : 'Semua stok aman'}
            >
              <span className="text-sm">🔔</span>
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {lowStockCount}
                </span>
              )}
            </button>

            {/* Dropdown Panel */}
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">🔔</span>
                    <span className="text-sm font-bold text-white">Notifikasi Stok</span>
                  </div>
                  {lowStockCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                      {lowStockCount} item
                    </span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                  {lowStockItems.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <p className="text-xs text-slate-400 font-medium">Semua stok dalam kondisi aman</p>
                    </div>
                  ) : (
                    lowStockItems.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setShowNotif(false); onNavigateTab('inventory'); }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-all flex items-center gap-3"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${p.stock === 0
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                          }`}>
                          {p.stock === 0 ? '❌' : '⚠️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.sku}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-bold ${p.stock === 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                            {p.stock} pcs
                          </p>
                          <p className="text-[10px] text-slate-500">tersisa</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {lowStockItems.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-slate-800">
                    <button
                      onClick={() => { setShowNotif(false); onNavigateTab('inventory'); }}
                      className="w-full py-1.5 rounded-xl text-xs font-semibold text-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
                    >
                      Lihat Semua di Inventory →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-800 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all text-sm"
          >
            {currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Info & Logout Button */}
          {authUser && (
            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
              <div className="hidden lg:flex flex-col text-right leading-tight">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{authUser.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">@{authUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 active:scale-95"
                title="Keluar / Logout"
              >
                <span>🔒</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
