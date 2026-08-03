// Data Dummy Realistis Inventaris Toko Komputer (Sparepart & Aksesoris)

window.INITIAL_CATEGORIES = [
  'Processor',
  'Kartu Grafis (GPU)',
  'Motherboard',
  'Memori (RAM)',
  'Penyimpanan (SSD/HDD)',
  'Power Supply (PSU)',
  'Casing PC',
  'Pendingin (Cooling)',
  'Aksesoris & Perifer'
];

window.INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'CPU-INT-001',
    name: 'Intel Core i7-14700K 3.4GHz 20-Cores LGA1700',
    category: 'Processor',
    brand: 'Intel',
    buyPrice: 6250000,
    sellPrice: 6999000,
    stock: 12,
    location: 'Rak A1 - Processor',
    description: 'Processor Intel 14th Gen Raptor Lake Refresh dengan 20 Core 28 Thread',
    createdAt: '2026-07-01'
  },
  {
    id: 'prod-002',
    sku: 'CPU-AMD-002',
    name: 'AMD Ryzen 7 7800X3D 4.2GHz 8-Cores AM5',
    category: 'Processor',
    brand: 'AMD',
    buyPrice: 6100000,
    sellPrice: 6799000,
    stock: 3, // Low stock (<5)
    location: 'Rak A1 - Processor',
    description: 'Processor gaming terbaik dengan teknologi 3D V-Cache 96MB',
    createdAt: '2026-07-05'
  },
  {
    id: 'prod-003',
    sku: 'GPU-NVI-001',
    name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB OC',
    category: 'Kartu Grafis (GPU)',
    brand: 'ASUS',
    buyPrice: 15400000,
    sellPrice: 17250000,
    stock: 4, // Low stock (<5)
    location: 'Rak B1 - GPU High End',
    description: 'VGA Gaming 4K DLSS 3.5 Triple Fan RGB Sync',
    createdAt: '2026-07-10'
  },
  {
    id: 'prod-004',
    sku: 'GPU-NVI-002',
    name: 'MSI GeForce RTX 4060 Ventus 2X Black 8GB OC',
    category: 'Kartu Grafis (GPU)',
    brand: 'MSI',
    buyPrice: 4650000,
    sellPrice: 5199000,
    stock: 18,
    location: 'Rak B2 - GPU Mainstream',
    description: 'VGA Dual Fan efisien daya cocok untuk racikan PC 1080p',
    createdAt: '2026-07-12'
  },
  {
    id: 'prod-005',
    sku: 'MB-ASU-001',
    name: 'ASUS ROG Strix B650-E Gaming WiFi AM5 DDR5',
    category: 'Motherboard',
    brand: 'ASUS',
    buyPrice: 4200000,
    sellPrice: 4750000,
    stock: 8,
    location: 'Rak C1 - Mobo AM5',
    description: 'Motherboard ATX dengan PCIe 5.0, WiFi 6E, 16+2 Power Stages',
    createdAt: '2026-07-15'
  },
  {
    id: 'prod-006',
    sku: 'RAM-COR-001',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    category: 'Memori (RAM)',
    brand: 'Corsair',
    buyPrice: 1850000,
    sellPrice: 2150000,
    stock: 2, // Low stock (<5)
    location: 'Rak D1 - Memori DDR5',
    description: 'Kit RAM DDR5 High Speed Dual Channel Intel XMP / AMD EXPO',
    createdAt: '2026-07-18'
  },
  {
    id: 'prod-007',
    sku: 'SSD-SAM-001',
    name: 'Samsung 990 Pro 2TB NVMe M.2 PCIe 4.0 SSD',
    category: 'Penyimpanan (SSD/HDD)',
    brand: 'Samsung',
    buyPrice: 2750000,
    sellPrice: 3099000,
    stock: 15,
    location: 'Rak D2 - Storage NVMe',
    description: 'SSD NVMe Read speed up to 7450 MB/s Write speed 6900 MB/s',
    createdAt: '2026-07-20'
  },
  {
    id: 'prod-008',
    sku: 'SSD-KNG-002',
    name: 'Kingston NV2 1TB NVMe M.2 Gen4 SSD',
    category: 'Penyimpanan (SSD/HDD)',
    brand: 'Kingston',
    buyPrice: 920000,
    sellPrice: 1049000,
    stock: 25,
    location: 'Rak D2 - Storage NVMe',
    description: 'SSD NVMe Budget terlaris kecepatan baca 3500 MB/s',
    createdAt: '2026-07-21'
  },
  {
    id: 'prod-009',
    sku: 'PSU-COR-001',
    name: 'Corsair RM850x 850W 80 Plus Gold Fully Modular',
    category: 'Power Supply (PSU)',
    brand: 'Corsair',
    buyPrice: 2100000,
    sellPrice: 2399000,
    stock: 6,
    location: 'Gudang Utama - Rak E1',
    description: 'Power Supply 850 Watt sertifikasi 80+ Gold Garansi 10 Tahun',
    createdAt: '2026-07-22'
  },
  {
    id: 'prod-010',
    sku: 'CAS-LIA-001',
    name: 'Lian Li O11 Dynamic EVO Black Dual Chamber ATX',
    category: 'Casing PC',
    brand: 'Lian Li',
    buyPrice: 2450000,
    sellPrice: 2799000,
    stock: 1, // Low stock (<5)
    location: 'Gudang Utama - Area Case',
    description: 'Casing Tempered Glass Panoramik ikonik untuk watercooling kustom',
    createdAt: '2026-07-23'
  },
  {
    id: 'prod-011',
    sku: 'CLR-NZX-001',
    name: 'NZXT Kraken Elite 360 RGB Liquid Cooler LCD',
    category: 'Pendingin (Cooling)',
    brand: 'NZXT',
    buyPrice: 3800000,
    sellPrice: 4299000,
    stock: 0, // Habis (0)
    location: 'Rak E2 - Cooling',
    description: 'AIO Water Cooler 360mm dengan layar LCD 2.36 inch dapat menampilkan GIF/Temp',
    createdAt: '2026-07-25'
  },
  {
    id: 'prod-012',
    sku: 'PER-LOG-001',
    name: 'Logitech G Pro X Superlight 2 Wireless Gaming Mouse',
    category: 'Aksesoris & Perifer',
    brand: 'Logitech',
    buyPrice: 1950000,
    sellPrice: 2249000,
    stock: 10,
    location: 'Etalase Depan - Aksesoris',
    description: 'Mouse Wireless 60 gram sensor HERO 2 32000 DPI USB-C',
    createdAt: '2026-07-26'
  },
  {
    id: 'prod-013',
    sku: 'PER-KEY-002',
    name: 'Keychron V1 QMK Custom Mechanical Keyboard RGB',
    category: 'Aksesoris & Perifer',
    brand: 'Keychron',
    buyPrice: 1150000,
    sellPrice: 1399000,
    stock: 7,
    location: 'Etalase Depan - Aksesoris',
    description: 'Mechanical keyboard Hot-swappable Keychron K Pro Red switch',
    createdAt: '2026-07-28'
  },
  {
    id: 'prod-014',
    sku: 'MB-MSI-002',
    name: 'MSI MAG B760 Tomahawk WiFi Intel LGA1700',
    category: 'Motherboard',
    brand: 'MSI',
    buyPrice: 3100000,
    sellPrice: 3499000,
    stock: 9,
    location: 'Rak C2 - Mobo Intel',
    description: 'Motherboard gaming solid DDR5 support Intel Core Gen 12, 13, 14',
    createdAt: '2026-07-29'
  },
  {
    id: 'prod-015',
    sku: 'PSU-SEA-002',
    name: 'Seasonic Focus GX-750 750W 80 Plus Gold Modular',
    category: 'Power Supply (PSU)',
    brand: 'Seasonic',
    buyPrice: 1750000,
    sellPrice: 1999000,
    stock: 14,
    location: 'Gudang Utama - Rak E1',
    description: 'Power supply 750W handal efisiensi tinggi garansi resmi 10 tahun',
    createdAt: '2026-07-30'
  }
];

window.INITIAL_TRANSACTIONS = [
  {
    id: 'trx-001',
    productId: 'prod-001',
    productSku: 'CPU-INT-001',
    productName: 'Intel Core i7-14700K 3.4GHz 20-Cores LGA1700',
    type: 'MASUK', // 'MASUK' or 'KELUAR'
    quantity: 10,
    unitPrice: 6250000,
    totalPrice: 62500000,
    reference: 'PO-SUP-2026-0701 (PT Nusantara Komputer)',
    notes: 'Restock rutin dari distributor utama Intel',
    timestamp: '2026-07-31T09:30:00'
  },
  {
    id: 'trx-002',
    productId: 'prod-003',
    productSku: 'GPU-NVI-001',
    productName: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB OC',
    type: 'KELUAR',
    quantity: 1,
    unitPrice: 17250000,
    totalPrice: 17250000,
    reference: 'INV-2026-0801-042',
    notes: 'Penjualan ke Bapak Budi - Rakitan PC Editing',
    timestamp: '2026-08-01T14:15:00'
  },
  {
    id: 'trx-003',
    productId: 'prod-006',
    productSku: 'RAM-COR-001',
    productName: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    type: 'KELUAR',
    quantity: 2,
    unitPrice: 2150000,
    totalPrice: 4300000,
    reference: 'INV-2026-0802-005',
    notes: 'Penjualan Tokopedia #TKP-882194',
    timestamp: '2026-08-02T11:05:00'
  },
  {
    id: 'trx-004',
    productId: 'prod-011',
    productSku: 'CLR-NZX-001',
    productName: 'NZXT Kraken Elite 360 RGB Liquid Cooler LCD',
    type: 'KELUAR',
    quantity: 1,
    unitPrice: 4299000,
    totalPrice: 4299000,
    reference: 'INV-2026-0802-019',
    notes: 'Penjualan Offline Store Toko',
    timestamp: '2026-08-02T16:40:00'
  }
];

window.INITIAL_USERS = [
  {
    id: 'usr-admin',
    username: 'admin',
    password: 'admin',
    name: 'Administrator Toko',
    role: 'admin',
    active: true,
    createdAt: '2026-07-01T00:00:00'
  },
  {
    id: 'usr-kasir1',
    username: 'kasir1',
    password: '123',
    name: 'Budi (Kasir Shift 1)',
    role: 'kasir',
    active: true,
    createdAt: '2026-07-01T00:00:00'
  }
];
