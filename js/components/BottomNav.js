// BottomNav Component — Android-style bottom navigation bar

window.BottomNav = function BottomNav({ activeTab, onSelectTab }) {
  const items = [
    { id: 'pos', label: 'Kasir POS', icon: '🏪' },
    { id: 'inventory', label: 'Inventaris', icon: '📦' },
    { id: 'transactions', label: 'Transaksi', icon: '🔄' },
    { id: 'reports', label: 'Laporan', icon: '📊' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️' }
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-all ${isActive ? 'text-blue-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <span className="text-lg leading-none mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
