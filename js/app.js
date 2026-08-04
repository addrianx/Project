// App.js — Main application controller (state, handlers, routing)
// All components are loaded via window.* globals from separate script tags

const { useState, useEffect, useMemo } = React;

function App() {
  const storage = window.InventoryStorage;
  const utils = window.InventoryUtils;

  // ─── State ───────────────────────────────────────────────
  const [products, setProducts] = useState(() => storage.getProducts());
  const [transactions, setTransactions] = useState(() => storage.getTransactions());
  const [categories, setCategories] = useState(() => storage.getCategories());
  const [users, setUsers] = useState(() => storage.getUsers());
  const [authUser, setAuthUser] = useState(() => {
    const savedAuth = storage.getAuthUser();
    if (savedAuth) return savedAuth;
    const rememberedUserId = storage.getRememberMe();
    if (rememberedUserId) {
      const allUsers = storage.getUsers();
      const rememberedUser = allUsers.find(u => u.id === rememberedUserId && u.active !== false);
      if (rememberedUser) {
        storage.saveAuthUser(rememberedUser);
        storage.saveRole(rememberedUser.role);
        return rememberedUser;
      } else {
        storage.clearRememberMe();
      }
    }
    return null;
  });
  const [theme, setTheme] = useState(() => storage.getTheme());
  const [userRole, setUserRole] = useState(() => {
    const savedAuth = storage.getAuthUser();
    return savedAuth ? savedAuth.role : storage.getRole();
  });

  const [activeTab, setActiveTab] = useState('pos');
  const [globalSearch, setGlobalSearch] = useState('');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalTargetId, setStockModalTargetId] = useState(null);
  const [stockModalType, setStockModalType] = useState('MASUK');
  const [toastMessage, setToastMessage] = useState('');

  const [adminAuthModal, setAdminAuthModal] = useState({
    isOpen: false, title: '', description: '', actionType: null, pendingRestoreData: null
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false, title: '', message: '',
    confirmText: 'Ya, Lanjutkan', confirmBg: 'bg-rose-600 hover:bg-rose-500',
    icon: '⚠️', onConfirm: () => {}
  });

  // ─── LocalStorage Sync ────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
    storage.saveTheme(theme);
  }, [theme]);
  useEffect(() => { storage.saveProducts(products); }, [products]);
  useEffect(() => { storage.saveTransactions(transactions); }, [transactions]);
  useEffect(() => { storage.saveCategories(categories); }, [categories]);
  useEffect(() => { storage.saveUsers(users); }, [users]);
  useEffect(() => { storage.saveAuthUser(authUser); }, [authUser]);

  // ─── Computed ─────────────────────────────────────────────
  const stats = useMemo(() => utils.calculateStats(products), [products]);

  // ─── Helpers ──────────────────────────────────────────────
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const openConfirmModal = (config) => {
    setConfirmDialog({
      isOpen: true,
      title: config.title || 'Konfirmasi Tindakan',
      message: config.message || 'Apakah Anda yakin?',
      confirmText: config.confirmText || 'Ya, Lanjutkan',
      confirmBg: config.confirmBg || 'bg-rose-600 hover:bg-rose-500',
      icon: config.icon || '⚠️',
      onConfirm: config.onConfirm || (() => {})
    });
  };

  // ─── Auth Handlers ────────────────────────────────────────
  const handleLogin = (user, remember = false) => {
    setAuthUser(user);
    setUserRole(user.role);
    storage.saveAuthUser(user);
    storage.saveRole(user.role);
    if (remember) {
      storage.saveRememberMe(user.id);
      showToast(`Selamat datang, ${user.name}! Login tersimpan 14 hari.`);
    } else {
      storage.clearRememberMe();
      showToast(`Selamat datang kembali, ${user.name}! (${user.role.toUpperCase()})`);
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    storage.saveAuthUser(null);
    storage.clearRememberMe();
    showToast('Anda telah berhasil keluar dari akun.');
  };

  const handleLogoutRequest = () => {
    openConfirmModal({
      title: '🚪 Konfirmasi Keluar / Logout',
      message: `Apakah Anda yakin ingin keluar dari akun "${authUser?.name}" (@${authUser?.username})?`,
      confirmText: 'Ya, Keluar',
      confirmBg: 'bg-rose-600 hover:bg-rose-500',
      icon: '🚪',
      onConfirm: handleLogout
    });
  };

  // ─── Product Handlers ─────────────────────────────────────
  const handleSaveProduct = (productData) => {
    if (userRole !== 'admin') { showToast('Akses ditolak: Hanya Admin yang dapat menambah/mengedit barang.'); return; }
    if (productData.id) {
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      showToast(`Produk "${productData.name}" diperbarui!`);
    } else {
      const newProduct = { ...productData, id: 'prod-' + Date.now(), createdAt: new Date().toISOString() };
      setProducts(prev => [newProduct, ...prev]);
      if (newProduct.stock > 0) {
        setTransactions(prev => [{
          id: 'trx-' + Date.now(),
          productId: newProduct.id,
          productSku: newProduct.sku,
          productName: newProduct.name,
          type: 'MASUK',
          quantity: newProduct.stock,
          unitPrice: newProduct.buyPrice,
          totalPrice: newProduct.buyPrice * newProduct.stock,
          reference: 'Stok Awal',
          timestamp: new Date().toISOString()
        }, ...prev]);
      }
      showToast(`Produk "${newProduct.name}" ditambahkan!`);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // ─── Transaction Handlers ─────────────────────────────────
  const handleSaveTransactionsBatch = (trxList) => {
    const items = Array.isArray(trxList) ? trxList : [trxList];
    if (items.length === 0) return;

    const timestampBase = Date.now();
    const newTrxArray = items.map((item, idx) => ({ ...item, id: 'trx-' + timestampBase + '-' + idx }));

    const inventoryItems = items.filter(trx => !trx.isCustomItem);
    if (inventoryItems.length > 0) {
      setProducts(prevProducts => {
        let updated = [...prevProducts];
        inventoryItems.forEach(trx => {
          updated = updated.map(p => {
            if (p.id === trx.productId) {
              const currentQty = Number(p.stock) || 0;
              const delta = trx.type === 'MASUK' ? trx.quantity : -trx.quantity;
              return { ...p, stock: Math.max(0, currentQty + delta) };
            }
            return p;
          });
        });
        return updated;
      });
    }

    setTransactions(prev => [...newTrxArray, ...prev]);

    const customCount = items.filter(t => t.isCustomItem).length;
    const inventoryCount = items.length - customCount;
    const totalPcs = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalRevenue = items.reduce((sum, i) => sum + i.totalPrice, 0);

    if (items.length === 1) {
      const item = items[0];
      if (item.isCustomItem) {
        showToast(`✍️ Item Bebas "${item.productName}" (${item.quantity} pcs) tercatat — Rp ${totalRevenue.toLocaleString('id-ID')}`);
      } else {
        showToast(`Stok ${item.type} (${item.quantity} pcs) berhasil diproses!`);
      }
    } else {
      const parts = [];
      if (inventoryCount > 0) parts.push(`${inventoryCount} item inventory`);
      if (customCount > 0) parts.push(`${customCount} item bebas`);
      showToast(`Transaksi selesai: ${parts.join(' + ')} (${totalPcs} pcs) berhasil!`);
    }
  };

  const handleConfirmDeleteProduct = (product) => {
    openConfirmModal({
      title: `📦 Hapus Produk [${product.sku}]?`,
      message: `Produk "${product.name}" akan dihapus permanen dari inventaris toko.`,
      confirmText: 'Hapus Produk',
      confirmBg: 'bg-rose-600 hover:bg-rose-500',
      icon: '🗑️',
      onConfirm: () => {
        if (userRole !== 'admin') { showToast('Akses ditolak: Hanya Admin yang dapat menghapus barang.'); return; }
        setProducts(prev => prev.filter(p => p.id !== product.id));
        showToast(`Produk "${product.name}" dihapus.`);
      }
    });
  };

  const handleConfirmDeleteTransaction = (trx) => {
    openConfirmModal({
      title: `🗑️ Hapus Transaksi ${trx.id}?`,
      message: `Transaksi "${trx.productName}" (${trx.type}) akan dihapus permanen.`,
      confirmText: 'Hapus Transaksi',
      confirmBg: 'bg-rose-600 hover:bg-rose-500',
      icon: '🗑️',
      onConfirm: () => {
        if (userRole !== 'admin') { showToast('Akses ditolak: Hanya Admin yang dapat menghapus transaksi.'); return; }
        setTransactions(prev => prev.filter(t => t.id !== trx.id));
        showToast(`Transaksi "${trx.productName}" dihapus.`);
      }
    });
  };

  // ─── Backup / Restore / Reset ─────────────────────────────
  const handleBackupRequest = () => {
    if (userRole !== 'admin') { showToast('Akses ditolak: Hanya Admin yang dapat mengunduh backup.'); return; }
    setAdminAuthModal({ isOpen: true, title: '🔒 Verifikasi Password - Backup Database', description: 'Masukkan password Admin untuk mengunduh berkas cadangan database (JSON).', actionType: 'BACKUP', pendingRestoreData: null });
  };

  const executeBackup = () => {
    const backupObject = {
      app: 'Cipta POS Toko Komputer', version: '1.0.0',
      backupDate: new Date().toISOString(),
      products, transactions, categories, users
    };
    const jsonStr = JSON.stringify(backupObject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateFormatted = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `ciptapos_backup_${dateFormatted}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📥 Berkas backup database berhasil diunduh!');
  };

  const handleRestoreRequest = () => {
    if (userRole !== 'admin') { showToast('Akses ditolak: Hanya Admin yang dapat memulihkan database.'); return; }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!parsed.products || !parsed.categories) { alert('Format file backup JSON tidak valid!'); return; }
          setAdminAuthModal({
            isOpen: true,
            title: '🔒 Verifikasi Password - Restore Database',
            description: `File backup berisi ${parsed.products?.length || 0} produk & ${parsed.transactions?.length || 0} riwayat. Masukkan password Admin untuk memulihkan.`,
            actionType: 'RESTORE',
            pendingRestoreData: parsed
          });
        } catch (err) {
          alert('Gagal membaca file JSON backup: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const executeRestore = (data) => {
    if (!data) return;
    if (data.products) { setProducts(data.products); storage.saveProducts(data.products); }
    if (data.transactions) { setTransactions(data.transactions); storage.saveTransactions(data.transactions); }
    if (data.categories) { setCategories(data.categories); storage.saveCategories(data.categories); }
    if (data.users) { setUsers(data.users); storage.saveUsers(data.users); }
    showToast(`📤 Restore database berhasil! (${data.products?.length || 0} produk dipulihkan)`);
  };

  const handleResetRequest = () => {
    if (userRole !== 'admin') { showToast('Akses ditolak: Hanya Admin yang dapat mereset database.'); return; }
    setAdminAuthModal({ isOpen: true, title: '🔒 Verifikasi Password - Reset Database', description: 'PERINGATAN: Seluruh data toko akan di-reset ke data dummy awal! Masukkan password Admin untuk konfirmasi.', actionType: 'RESET', pendingRestoreData: null });
  };

  const executeReset = () => {
    const defaults = storage.resetToDefault();
    setProducts(defaults.products);
    setTransactions(defaults.transactions);
    setCategories(defaults.categories);
    setUsers(defaults.users);
    setAuthUser(null);
    showToast('🔄 Database berhasil di-reset ke data dummy awal! Silakan login kembali.');
  };

  const handleConfirmAdminAction = () => {
    if (adminAuthModal.actionType === 'BACKUP') executeBackup();
    else if (adminAuthModal.actionType === 'RESTORE') executeRestore(adminAuthModal.pendingRestoreData);
    else if (adminAuthModal.actionType === 'RESET') executeReset();
  };

  // ─── Render ───────────────────────────────────────────────

  // Login screen if not authenticated
  if (!authUser) {
    return (
      <>
        <window.LoginScreen onLogin={handleLogin} users={users} />
        <window.Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <window.Header
        currentTheme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        lowStockCount={stats.lowStockCount}
        onOpenAddModal={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
        onOpenStockModal={(id = null, type = 'MASUK') => { setStockModalTargetId(id); setStockModalType(type); setIsStockModalOpen(true); }}
        onNavigateTab={setActiveTab}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        stats={stats}
        userRole={userRole}
        authUser={authUser}
        onLogout={handleLogoutRequest}
        products={products}
      />

      {/* Main Content — scrolls internally */}
      <main className="app-main">
        {activeTab === 'pos' && (
          <window.POSCatalogView
            products={products}
            categories={categories}
            searchTerm={globalSearch}
            setSearchTerm={setGlobalSearch}
            onOpenStockModal={(id, type) => { setStockModalTargetId(id); setStockModalType(type); setIsStockModalOpen(true); }}
          />
        )}
        {activeTab === 'inventory' && (
          <window.ProductTable
            products={products}
            categories={categories}
            searchTerm={globalSearch}
            setSearchTerm={setGlobalSearch}
            onOpenAddModal={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onOpenEditModal={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onOpenStockModal={(id, type) => { setStockModalTargetId(id); setStockModalType(type); setIsStockModalOpen(true); }}
            onConfirmDelete={handleConfirmDeleteProduct}
            userRole={userRole}
          />
        )}
        {activeTab === 'transactions' && (
          <window.TransactionHistory
            transactions={transactions}
            onOpenStockModal={(id, type) => { setStockModalTargetId(id); setStockModalType(type); setIsStockModalOpen(true); }}
            onConfirmDelete={handleConfirmDeleteTransaction}
            userRole={userRole}
          />
        )}
        {activeTab === 'reports' && <window.ReportView products={products} categories={categories} />}
        {activeTab === 'settings' && (
          <window.SettingsView
            onRequestBackup={handleBackupRequest}
            onRequestRestore={handleRestoreRequest}
            onRequestReset={handleResetRequest}
            onRequestConfirm={openConfirmModal}
            categories={categories}
            setCategories={setCategories}
            products={products}
            productsCount={products.length}
            userRole={userRole}
            users={users}
            setUsers={setUsers}
            authUser={authUser}
          />
        )}
      </main>

      {/* FAB (Admin Only) */}
      {userRole === 'admin' && (
        <button
          onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
          className="fab-button font-bold"
          title="Tambah Barang Baru"
        >+</button>
      )}

      {/* Bottom Navigation */}
      <window.BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Modals */}
      <window.ProductModal
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        categories={categories}
        initialData={editingProduct}
      />
      <window.StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSaveTransactionsBatch={handleSaveTransactionsBatch}
        products={products}
        initialProductId={stockModalTargetId}
        initialType={stockModalType}
      />
      <window.ConfirmDialogModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmBg={confirmDialog.confirmBg}
        icon={confirmDialog.icon}
      />
      <window.AdminPasswordModal
        isOpen={adminAuthModal.isOpen}
        onClose={() => setAdminAuthModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAdminAction}
        title={adminAuthModal.title}
        description={adminAuthModal.description}
        authUser={authUser}
      />
      <window.Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

// Mount React App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
