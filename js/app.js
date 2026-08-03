// Main React Application Controller

const { useState, useEffect, useMemo, useCallback } = React;

function App() {
  const storage = window.InventoryStorage;
  const utils = window.InventoryUtils;

  // Primary State
  const [products, setProducts] = useState(() => storage.getProducts());
  const [transactions, setTransactions] = useState(() => storage.getTransactions());
  const [categories, setCategories] = useState(() => storage.getCategories());
  const [theme, setTheme] = useState(() => storage.getTheme());
  
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'inventory', 'transactions', 'reports', 'settings'
  const [globalSearch, setGlobalSearch] = useState('');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalTargetId, setStockModalTargetId] = useState(null);
  const [stockModalType, setStockModalType] = useState('MASUK');

  const [deletingProduct, setDeletingProduct] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync Theme to HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    storage.saveTheme(theme);
  }, [theme]);

  // Sync Products to LocalStorage
  useEffect(() => {
    storage.saveProducts(products);
  }, [products]);

  // Sync Transactions to LocalStorage
  useEffect(() => {
    storage.saveTransactions(transactions);
  }, [transactions]);

  // Sync Categories to LocalStorage
  useEffect(() => {
    storage.saveCategories(categories);
  }, [categories]);

  // Calculate High-level Stats
  const stats = useMemo(() => {
    return utils.calculateStats(products);
  }, [products]);

  // Theme Toggle Handler
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // ADD or EDIT Product Handler
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // EDIT
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      showToast(`Produk "${productData.name}" berhasil diperbarui!`, 'success');
    } else {
      // ADD NEW
      const newProduct = {
        ...productData,
        id: 'prod-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      setProducts(prev => [newProduct, ...prev]);

      // Automatically record initial stock transaction if stock > 0
      if (newProduct.stock > 0) {
        const initTrx = {
          id: 'trx-' + Date.now(),
          productId: newProduct.id,
          productSku: newProduct.sku,
          productName: newProduct.name,
          type: 'MASUK',
          quantity: newProduct.stock,
          unitPrice: newProduct.buyPrice,
          totalPrice: newProduct.buyPrice * newProduct.stock,
          reference: 'Stok Awal Sistem',
          notes: 'Pemasukan stok pertama saat pendaftaran barang baru',
          timestamp: new Date().toISOString()
        };
        setTransactions(prev => [initTrx, ...prev]);
      }

      showToast(`Produk "${newProduct.name}" berhasil ditambahkan!`, 'success');
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  // Open Quick Stock Modal
  const handleOpenStockModal = (productId = null, type = 'MASUK') => {
    setStockModalTargetId(productId);
    setStockModalType(type);
    setIsStockModalOpen(true);
  };

  // Save Stock Transaction Handler (Barang Masuk / Keluar)
  const handleSaveTransaction = (trxData) => {
    const newTrx = {
      ...trxData,
      id: 'trx-' + Date.now()
    };

    // Update product stock in memory
    setProducts(prev => prev.map(p => {
      if (p.id === trxData.productId) {
        const currentQty = Number(p.stock) || 0;
        const delta = trxData.type === 'MASUK' ? trxData.quantity : -trxData.quantity;
        return {
          ...p,
          stock: Math.max(0, currentQty + delta)
        };
      }
      return p;
    }));

    setTransactions(prev => [newTrx, ...prev]);

    const msgAction = trxData.type === 'MASUK' ? 'Restock barang masuk' : 'Penjualan barang keluar';
    showToast(`${msgAction} (${trxData.quantity} pcs) [${trxData.productSku}] berhasil dicatat!`, 'success');
  };

  // Delete Product Handler
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    
    setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
    showToast(`Produk "${deletingProduct.name}" telah dihapus dari inventaris.`, 'warning');
    setDeletingProduct(null);
  };

  // Reset to initial dummy data
  const handleResetData = () => {
    const defaults = storage.resetToDefault();
    setProducts(defaults.products);
    setTransactions(defaults.transactions);
    setCategories(defaults.categories);
    showToast('Database berhasil di-reset ke Data Dummy Realistis!', 'info');
  };

  // Add Category Handler
  const handleAddCategory = (newCatName) => {
    if (!categories.includes(newCatName)) {
      setCategories(prev => [...prev, newCatName]);
      showToast(`Kategori "${newCatName}" berhasil ditambahkan!`, 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      
      {/* Top Header / Navbar */}
      <window.Header
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        lowStockCount={stats.lowStockCount}
        onOpenAddModal={handleOpenAddModal}
        onOpenStockModal={handleOpenStockModal}
        onNavigateTab={setActiveTab}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-4 lg:p-6 gap-6">
        
        {/* Left Sidebar */}
        <window.Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          stats={stats}
        />

        {/* Right Main Workspace */}
        <main className="flex-1 min-w-0">
          
          {activeTab === 'dashboard' && (
            <window.Dashboard
              products={products}
              transactions={transactions}
              onOpenStockModal={handleOpenStockModal}
              onNavigateTab={setActiveTab}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activeTab === 'inventory' && (
            <window.ProductTable
              products={products}
              categories={categories}
              searchTerm={globalSearch}
              setSearchTerm={setGlobalSearch}
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onOpenStockModal={handleOpenStockModal}
              onConfirmDelete={setDeletingProduct}
            />
          )}

          {activeTab === 'transactions' && (
            <window.TransactionHistory
              transactions={transactions}
              onOpenStockModal={handleOpenStockModal}
            />
          )}

          {activeTab === 'reports' && (
            <window.ReportView
              products={products}
              categories={categories}
            />
          )}

          {activeTab === 'settings' && (
            <window.SettingsView
              onResetData={handleResetData}
              onAddCategory={handleAddCategory}
              categories={categories}
              productsCount={products.length}
              transactionsCount={transactions.length}
            />
          )}

        </main>

      </div>

      {/* Modals & Dialogs */}
      <window.ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        categories={categories}
        initialData={editingProduct}
      />

      <window.StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSaveTransaction={handleSaveTransaction}
        products={products}
        initialProductId={stockModalTargetId}
        initialType={stockModalType}
      />

      <window.DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        product={deletingProduct}
      />

      {/* Toast Popup */}
      {toast && (
        <window.Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

// Render React App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
