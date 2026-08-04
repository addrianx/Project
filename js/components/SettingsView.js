// SettingsView — App settings: user management, categories, backup/restore/reset

window.SettingsView = function SettingsView({ onRequestBackup, onRequestRestore, onRequestReset, onRequestConfirm, categories, setCategories, products, productsCount, userRole, users = [], setUsers, authUser }) {
  const { useState } = React;
  const CATEGORY_ICONS = window.CATEGORY_ICONS;
  const [newCatName, setNewCatName] = useState('');
  const [error, setError] = useState('');

  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('kasir');
  const [userError, setUserError] = useState('');

  const handleAddCategory = () => {
    if (userRole !== 'admin') return;
    const trimmed = newCatName.trim();
    if (!trimmed) { setError('Nama kategori tidak boleh kosong.'); return; }
    if (categories.includes(trimmed)) { setError('Kategori sudah ada.'); return; }
    setCategories(prev => [...prev, trimmed]);
    setNewCatName('');
    setError('');
  };

  const handleDeleteCategory = (cat) => {
    if (userRole !== 'admin') return;
    const usedBy = products.filter(p => p.category === cat).length;
    if (usedBy > 0) {
      setError(`Kategori "${cat}" masih digunakan oleh ${usedBy} produk. Ubah atau hapus produk tersebut terlebih dahulu.`);
      return;
    }
    if (onRequestConfirm) {
      onRequestConfirm({
        title: `🏷️ Hapus Kategori "${cat}"?`,
        message: `Kategori "${cat}" akan dihapus permanen dari daftar kategori toko.`,
        confirmText: 'Hapus Kategori',
        confirmBg: 'bg-rose-600 hover:bg-rose-500',
        icon: '🗑️',
        onConfirm: () => { setCategories(prev => prev.filter(c => c !== cat)); setError(''); }
      });
    } else {
      setCategories(prev => prev.filter(c => c !== cat));
      setError('');
    }
  };

  const handleAddUser = () => {
    if (userRole !== 'admin') return;
    const trimmedUsername = newUserUsername.trim().toLowerCase();
    const trimmedName = newUserName.trim();

    if (!trimmedUsername || !trimmedName || !newUserPassword) {
      setUserError('Semua kolom pengguna wajib diisi.');
      return;
    }
    if (users.some(u => u.username.toLowerCase() === trimmedUsername)) {
      setUserError(`Username "${trimmedUsername}" sudah terpakai.`);
      return;
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      username: trimmedUsername,
      name: trimmedName,
      password: newUserPassword,
      role: newUserRole,
      active: true,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserUsername('');
    setNewUserName('');
    setNewUserPassword('');
    setNewUserRole('kasir');
    setUserError('');
  };

  const handleToggleUserActive = (targetUser) => {
    if (userRole !== 'admin') return;
    if (authUser && authUser.id === targetUser.id) {
      setUserError('Anda tidak dapat menonaktifkan akun sendiri yang sedang digunakan.');
      return;
    }
    const isDeactivating = targetUser.active;
    if (onRequestConfirm) {
      onRequestConfirm({
        title: isDeactivating ? `🚫 Nonaktifkan Akun ${targetUser.name}?` : `✅ Aktifkan Akun ${targetUser.name}?`,
        message: isDeactivating
          ? `Akun "${targetUser.name}" (@${targetUser.username}) tidak akan dapat digunakan untuk login.`
          : `Akun "${targetUser.name}" (@${targetUser.username}) akan dapat login kembali.`,
        confirmText: isDeactivating ? 'Nonaktifkan' : 'Aktifkan Akun',
        confirmBg: isDeactivating ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500',
        icon: isDeactivating ? '🚫' : '✅',
        onConfirm: () => { setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, active: !u.active } : u)); setUserError(''); }
      });
    } else {
      setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, active: !u.active } : u));
      setUserError('');
    }
  };

  return (
    <div className="space-y-4 max-w-xl pb-6">
      <h2 className="text-xl font-bold text-white">Pengaturan App</h2>

      {/* Banner Status Akun */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${userRole === 'admin'
        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{userRole === 'admin' ? '👨‍💼' : '🧑‍💻'}</span>
          <div>
            <p className="font-bold text-sm">Mode Akun: <span className="uppercase">{userRole}</span></p>
            <p className="text-[11px] opacity-80 mt-0.5">
              {userRole === 'admin'
                ? 'Akses penuh: Tambah, edit, hapus barang, kelola akun kasir, kategori & reset database.'
                : 'Akses terbatas: Hanya dapat melihat data & melakukan transaksi stok.'}
            </p>
          </div>
        </div>
      </div>

      {/* Manajemen Akun */}
      <div className="pos-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <h3 className="font-bold text-sm text-slate-200">Manajemen Akun Kasir &amp; Pengguna</h3>
          <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold">{users.length} akun</span>
        </div>

        {userRole === 'admin' ? (
          <div className="space-y-3 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-xs font-semibold text-slate-300">➕ Tambah Kasir / Pengguna Baru</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input type="text" placeholder="Username (misal: kasir2)" value={newUserUsername}
                onChange={e => { setNewUserUsername(e.target.value); setUserError(''); }} className="px-3 py-1.5 rounded-xl text-xs glass-input" />
              <input type="text" placeholder="Nama Lengkap Kasir..." value={newUserName}
                onChange={e => { setNewUserName(e.target.value); setUserError(''); }} className="px-3 py-1.5 rounded-xl text-xs glass-input" />
              <input type="password" placeholder="Password..." value={newUserPassword}
                onChange={e => { setNewUserPassword(e.target.value); setUserError(''); }} className="px-3 py-1.5 rounded-xl text-xs glass-input" />
              <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="px-3 py-1.5 rounded-xl text-xs glass-input">
                <option value="kasir">Kasir (Akses Terbatas)</option>
                <option value="admin">Admin (Akses Penuh)</option>
              </select>
            </div>
            <button onClick={handleAddUser} className="w-full py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow">
              + Tambah Akun Baru
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            🔒 Mode Kasir: Penambahan & menonaktifkan akun kasir hanya dapat dilakukan oleh Admin.
          </div>
        )}

        {userError && <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">⚠️ {userError}</p>}

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {users.map(u => {
            const isCurrent = authUser && authUser.id === u.id;
            return (
              <div key={u.id} className="cat-item">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">{u.role === 'admin' ? '👨‍💼' : '🧑‍💻'}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="cat-name truncate">{u.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">(@{u.username})</span>
                      {isCurrent && <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/30 text-blue-300 font-bold">(Anda)</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.1 rounded font-semibold uppercase ${u.role === 'admin' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{u.role}</span>
                      <span className={`text-[9px] px-1.5 py-0.1 rounded font-semibold ${u.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {u.active ? '🟢 Aktif' : '🔴 Nonaktif'}
                      </span>
                    </div>
                  </div>
                </div>

                {userRole === 'admin' && !isCurrent && (
                  <button onClick={() => handleToggleUserActive(u)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all active:scale-95 shrink-0 ${u.active
                      ? 'bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border-rose-500/30'
                      : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white border-emerald-500/30'
                      }`}>
                    {u.active ? '🚫 Nonaktifkan' : '✅ Aktifkan'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manajemen Kategori */}
      <div className="pos-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏷️</span>
          <h3 className="font-bold text-sm text-slate-200">Manajemen Kategori</h3>
          <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold">{categories.length} kategori</span>
        </div>

        {userRole === 'admin' ? (
          <div className="flex gap-2">
            <input type="text" value={newCatName}
              onChange={e => { setNewCatName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              placeholder="Nama kategori baru..."
              className="flex-1 px-3 py-1.5 rounded-xl text-xs glass-input" />
            <button onClick={handleAddCategory} className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-95 shrink-0">
              + Tambah
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            🔒 Mode Kasir: Penambahan dan penghapusan kategori hanya dapat dilakukan oleh Admin.
          </div>
        )}

        {error && <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">⚠️ {error}</p>}

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Belum ada kategori.</p>
          ) : (
            categories.map((cat) => {
              const usedCount = products.filter(p => p.category === cat).length;
              const icon = CATEGORY_ICONS[cat] || '📦';
              return (
                <div key={cat} className="cat-item">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{icon}</span>
                    <span className="cat-name truncate">{cat}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {usedCount > 0 ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">{usedCount} produk</span>
                    ) : (
                      <span className="cat-badge-empty">{usedCount} produk</span>
                    )}
                    {userRole === 'admin' && (
                      <button onClick={() => handleDeleteCategory(cat)}
                        title={usedCount > 0 ? `Masih dipakai ${usedCount} produk` : 'Hapus kategori'}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90 ${usedCount > 0 ? 'cat-del-disabled' : 'bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30'}`}>
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {userRole === 'admin' && (
          <p className="text-[10px] text-slate-500">💡 Kategori yang masih digunakan produk tidak dapat dihapus.</p>
        )}
      </div>

      {/* Pemeliharaan Database */}
      <div className="pos-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛠️</span>
          <h3 className="font-bold text-sm text-slate-200">Pemeliharaan Database &amp; System</h3>
        </div>
        <p className="text-xs text-slate-400">
          Kelola cadangan data toko ({productsCount} produk), pulihkan file backup JSON, atau atur ulang database. Memerlukan verifikasi password Admin.
        </p>

        {userRole === 'admin' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button onClick={onRequestBackup} className="p-3 rounded-2xl bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow">
              <span className="text-2xl">📥</span>
              <span>Backup (JSON)</span>
            </button>
            <button onClick={onRequestRestore} className="p-3 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow">
              <span className="text-2xl">📤</span>
              <span>Restore (JSON)</span>
            </button>
            <button onClick={onRequestReset} className="p-3 rounded-2xl bg-rose-600/15 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow">
              <span className="text-2xl">🔄</span>
              <span>Reset Database</span>
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            🔒 Mode Kasir: Menu backup, restore, dan reset database hanya dapat diakses oleh Admin dengan verifikasi password.
          </div>
        )}
      </div>
    </div>
  );
};
