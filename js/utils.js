// Helper utilities untuk aplikasi inventory toko komputer

window.InventoryUtils = {
  // Format mata uang Rupiah (contoh: Rp 6.999.000)
  formatRupiah: function(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format angka standar (contoh: 1.250)
  formatNumber: function(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  },

  // Format Tanggal (contoh: 3 Agustus 2026, 14:30)
  formatDate: function(dateString, includeTime = false) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat('id-ID', options).format(date);
  },

  // Generate otomatis Kode SKU unik berdasarkan Kategori & Merk
  generateSKU: function(category, brand) {
    const catPrefix = (category || 'GEN').substring(0, 3).toUpperCase();
    const brandPrefix = (brand || 'GEN').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${catPrefix}-${brandPrefix}-${randomNum}`;
  },

  // Mendapatkan Status Stok & Badge Color
  getStockStatus: function(stock) {
    if (stock <= 0) {
      return { label: 'Habis', type: 'habis', color: 'red' };
    } else if (stock <= 5) {
      return { label: 'Menipis', type: 'menipis', color: 'amber' };
    } else {
      return { label: 'Aman', type: 'aman', color: 'emerald' };
    }
  },

  // Menghitung Ringkasan Statistik Inventaris Toko
  calculateStats: function(products) {
    if (!products || !Array.isArray(products)) {
      return {
        totalItemTypes: 0,
        totalStockUnits: 0,
        totalAssetValue: 0,
        totalRevenuePotential: 0,
        lowStockCount: 0,
        outOfStockCount: 0
      };
    }

    let totalStockUnits = 0;
    let totalAssetValue = 0;
    let totalRevenuePotential = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      const stock = Number(p.stock) || 0;
      const buyPrice = Number(p.buyPrice) || 0;
      const sellPrice = Number(p.sellPrice) || 0;

      totalStockUnits += stock;
      totalAssetValue += (buyPrice * stock);
      totalRevenuePotential += (sellPrice * stock);

      if (stock <= 0) {
        outOfStockCount++;
      } else if (stock <= 5) {
        lowStockCount++;
      }
    });

    return {
      totalItemTypes: products.length,
      totalStockUnits: totalStockUnits,
      totalAssetValue: totalAssetValue,
      totalRevenuePotential: totalRevenuePotential,
      expectedProfit: totalRevenuePotential - totalAssetValue,
      lowStockCount: lowStockCount,
      outOfStockCount: outOfStockCount
    };
  },

  // Export data array ke file CSV
  exportToCSV: function(filename, rows) {
    if (!rows || !rows.length) return;
    
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  // Converter & Normalisasi Karakter (contoh: c<->k, v<->f, ph<->f)
  normalizeSearchText: function(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
      .replace(/c/g, 'k')
      .replace(/v/g, 'f')
      .replace(/ph/g, 'f')
      .replace(/z/g, 's')
      .replace(/y/g, 'i')
      .replace(/[^a-z0-9]/g, '');
  },

  // Sinonim Istilah Komputer & Hardware
  getSynonymKeywords: function(query) {
    const q = query.toLowerCase().trim();
    const synonyms = [q];

    const map = {
      'konverter': ['converter', 'adapter', 'kabel', 'converter hdmi'],
      'converter': ['konverter', 'adapter', 'kabel'],
      'vga': ['gpu', 'grafis', 'kartu grafis', 'graphics'],
      'gpu': ['vga', 'grafis', 'kartu grafis', 'graphics'],
      'grafis': ['vga', 'gpu', 'kartu grafis'],
      'cpu': ['processor', 'prosesor'],
      'prosesor': ['cpu', 'processor'],
      'processor': ['cpu', 'prosesor'],
      'ram': ['memori', 'memory'],
      'memori': ['ram', 'memory'],
      'mobo': ['motherboard', 'mainboard'],
      'motherboard': ['mobo', 'mainboard'],
      'psu': ['power supply'],
      'power': ['psu', 'power supply'],
      'casing': ['case', 'chassis'],
      'case': ['casing'],
      'cooling': ['cooler', 'pendingin', 'fan', 'liquid', 'aio'],
      'pendingin': ['cooling', 'cooler', 'fan', 'liquid'],
      'ssd': ['nvme', 'storage', 'penyimpanan'],
      'hdd': ['storage', 'penyimpanan'],
      'penyimpanan': ['ssd', 'hdd', 'storage', 'nvme']
    };

    Object.keys(map).forEach(key => {
      if (q.includes(key)) {
        synonyms.push(...map[key]);
      }
    });

    return synonyms;
  },

  // Pencarian Cerdas Barang (Bisa lacak berdasarkan ID Stock, SKU, Nama, Merk, Kategori, Converter k<->c)
  matchProductSearch: function(product, rawQuery) {
    if (!rawQuery || !rawQuery.trim()) return true;
    if (!product) return false;

    const query = rawQuery.toLowerCase().trim();

    // 1. Match langsung ID Stock / SKU / Nama / Merk / Lokasi / Kategori
    const fields = [
      product.id || '',
      product.sku || '',
      product.name || '',
      product.brand || '',
      product.category || '',
      product.location || '',
      product.description || ''
    ].map(f => f.toString().toLowerCase());

    const directMatch = fields.some(field => field.includes(query));
    if (directMatch) return true;

    // 2. Pencocokan Multi-Kata
    const words = query.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      const allWordsMatch = words.every(w => fields.some(f => f.includes(w)));
      if (allWordsMatch) return true;
    }

    // 3. Normalisasi Konverter & Fonetik (c<->k, v<->f)
    const normalizedQuery = this.normalizeSearchText(query);
    if (normalizedQuery.length >= 2) {
      const normalizedTarget = fields.map(f => this.normalizeSearchText(f)).join(' ');
      if (normalizedTarget.includes(normalizedQuery)) return true;
    }

    // 4. Ekspansi Sinonim
    const synonyms = this.getSynonymKeywords(query);
    for (const syn of synonyms) {
      if (syn !== query && fields.some(f => f.includes(syn))) {
        return true;
      }
    }

    return false;
  }
};
