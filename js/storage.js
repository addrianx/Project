// Storage Manager dengan LocalStorage Persistence

const STORAGE_KEYS = {
  PRODUCTS: 'toko_komputer_products_v1',
  TRANSACTIONS: 'toko_komputer_transactions_v1',
  CATEGORIES: 'toko_komputer_categories_v1',
  THEME: 'toko_komputer_theme_v1',
  ROLE: 'toko_komputer_role_v1',
  USERS: 'toko_komputer_users_v1',
  AUTH_USER: 'toko_komputer_auth_user_v1',
  REMEMBER_ME: 'toko_komputer_remember_me_v1'
};

window.InventoryStorage = {
  // Ambil Data Produk
  getProducts: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read products from LocalStorage', e);
    }
    // Fallback to initial dummy data
    this.saveProducts(window.INITIAL_PRODUCTS);
    return window.INITIAL_PRODUCTS;
  },

  // Simpan Data Produk
  saveProducts: function(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to LocalStorage', e);
    }
  },

  // Ambil Riwayat Transaksi
  getTransactions: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read transactions from LocalStorage', e);
    }
    this.saveTransactions(window.INITIAL_TRANSACTIONS);
    return window.INITIAL_TRANSACTIONS;
  },

  // Simpan Riwayat Transaksi
  saveTransactions: function(transactions) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to LocalStorage', e);
    }
  },

  // Ambil Kategori
  getCategories: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read categories from LocalStorage', e);
    }
    this.saveCategories(window.INITIAL_CATEGORIES);
    return window.INITIAL_CATEGORIES;
  },

  // Simpan Kategori
  saveCategories: function(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to LocalStorage', e);
    }
  },

  // Ambil Theme (Dark / Light)
  getTheme: function() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },

  // Simpan Theme
  saveTheme: function(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Ambil Role (admin / kasir)
  getRole: function() {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'admin';
  },

  // Simpan Role
  saveRole: function(role) {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  },

  // Ambil Data Akun Pengguna
  getUsers: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read users from LocalStorage', e);
    }
    this.saveUsers(window.INITIAL_USERS);
    return window.INITIAL_USERS;
  },

  // Simpan Data Akun Pengguna
  saveUsers: function(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to LocalStorage', e);
    }
  },

  // Ambil Sesi User Logged-in
  getAuthUser: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read auth user from LocalStorage', e);
    }
    return null;
  },

  // Simpan Sesi User Logged-in
  saveAuthUser: function(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch (e) {
      console.error('Failed to save auth user to LocalStorage', e);
    }
  },

  // Reset Data ke Dummy Awal
  resetToDefault: function() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(window.INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(window.INITIAL_USERS));
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    return {
      products: window.INITIAL_PRODUCTS,
      transactions: window.INITIAL_TRANSACTIONS,
      categories: window.INITIAL_CATEGORIES,
      users: window.INITIAL_USERS
    };
  },

  // Simpan token "Ingat Saya" dengan expiry 14 hari
  saveRememberMe: function(userId) {
    try {
      const expiry = Date.now() + (14 * 24 * 60 * 60 * 1000); // 14 hari dalam ms
      const token = { userId, expiry };
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(token));
    } catch (e) {
      console.error('Failed to save remember-me token', e);
    }
  },

  // Ambil token "Ingat Saya" — kembalikan userId jika masih valid, null jika kadaluarsa
  getRememberMe: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      if (!stored) return null;
      const token = JSON.parse(stored);
      if (!token || !token.expiry || !token.userId) return null;
      if (Date.now() > token.expiry) {
        // Token kadaluarsa, hapus otomatis
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        return null;
      }
      return token.userId;
    } catch (e) {
      console.error('Failed to read remember-me token', e);
      return null;
    }
  },

  // Hapus token "Ingat Saya" (saat logout)
  clearRememberMe: function() {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }
};
