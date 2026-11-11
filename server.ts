import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Storage helpers
function readJson<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Data models
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  condition: string;
  featured: boolean;
  newArrival: boolean;
  rareCollection?: boolean;
  status: 'published' | 'draft' | 'sold_out';
  mainImage: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  paymentMethod: 'ABA_BANK' | 'KHQR' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  paymentStatus: 'pending' | 'verified' | 'paid' | 'failed';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

// Initial Curated Seed Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: '2001 Japanese Pokémon 1st Edition Crystal Charizard Holo PSA 10 GEM MT',
    slug: '2001-pokemon-1st-ed-crystal-charizard-psa-10',
    category: 'PSA Graded Cards',
    brand: 'Pokémon TCG',
    price: 18500,
    discountPrice: 17200,
    stock: 1,
    condition: 'PSA 10 Gem Mint',
    featured: true,
    newArrival: false,
    rareCollection: true,
    status: 'published',
    mainImage: '/assets/aistudio/screen_55416fe7.png',
    images: [
      '/assets/aistudio/screen_55416fe7.png',
      '/assets/aistudio/screen_5d4c2460.png'
    ],
    description: 'The holy grail of the e-Card era. 2001 Japanese Mysterious Mountains (E-Series 5) 1st Edition Crystal Charizard graded PSA 10 Gem Mint. Features the pristine crystal elemental design with immaculate holographic foil reflection, flawless centering, and pristine sub-grades. Museum vault archival preservation.',
    specifications: {
      'Card Name': 'Crystal Charizard (リザードン)',
      'Set': 'Japanese Mysterious Mountains / e-Series 5',
      'Card Number': '#089/088 Secret Rare',
      'Rarity': '1st Edition Secret Holo',
      'Grading Company': 'PSA (Professional Sports Authenticator)',
      'Grade': 'GEM MT 10',
      'Certification Number': '43875191',
      'Language': 'Japanese'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-002',
    name: 'INNO64 1:64 Nissan Skyline GT-R R34 Nismo Clubman Spec (Bayside Blue)',
    slug: 'inno64-skyline-gtr-r34-bayside-blue',
    category: 'INNO64',
    brand: 'INNO64',
    price: 85,
    discountPrice: 75,
    stock: 8,
    condition: 'Brand New / Sealed Acrylic Base',
    featured: true,
    newArrival: true,
    rareCollection: false,
    status: 'published',
    mainImage: '/src/assets/images/diecast_inno64_gtr_1793761649676.jpg',
    images: [
      '/src/assets/images/diecast_inno64_gtr_1793761649676.jpg'
    ],
    description: 'Precision engineered 1:64 scale diecast model of the iconic Nissan Skyline GT-R R34 in factory OEM Bayside Blue with Nismo Clubman Race Spec aerokit, bronze forged 5-spoke wheels, detailed Recaro interior cockpit, and individual acrylic collector pedestal display case.',
    specifications: {
      'Manufacturer': 'INNO64 / Inno Models',
      'Car Model': 'Nissan Skyline GT-R (BNR34) Nismo CRS',
      'Scale': '1:64',
      'Material': 'Diecast metal chassis & body, real rubber tires',
      'Packaging': 'Collector acrylic display case with mirrored base',
      'Edition': 'Limited Production Run'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-003',
    name: 'LBWK Liberty Walk GT-R R35 Silhouette Works Matte Titanium Edition',
    slug: 'lbwk-liberty-walk-gtr-r35-matte-titanium',
    category: 'LBWK',
    brand: 'Liberty Walk / LB-Silhouette',
    price: 145,
    discountPrice: null,
    stock: 3,
    condition: 'Brand New In Box',
    featured: true,
    newArrival: true,
    rareCollection: true,
    status: 'published',
    mainImage: '/src/assets/images/diecast_lbwk_supercar_1793761647485.jpg',
    images: [
      '/src/assets/images/diecast_lbwk_supercar_1793761647485.jpg',
      '/assets/aistudio/screen_5d4c2460.png'
    ],
    description: 'Authorized LB-WORKS Nissan GT-R R35 widebody miniature masterpiece. Precision cast with hand-riveted fender flaring, aggressive rear diffuser, GT wing, bronze Forgiato wheels, and custom brushed titanium-finish collector plinth.',
    specifications: {
      'Manufacturer': 'Liberty Walk Official Merchandise',
      'Car Model': 'LB-Silhouette WORKS GT 35GT-RR',
      'Scale': '1:64',
      'Material': 'High Precision Resin / Diecast hybrid',
      'Finish': 'Matte Dark Gunmetal & Titanium with LBWK Livery',
      'License': 'Officially Licensed by Wataru Kato / Liberty Walk'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-004',
    name: 'Bandai Perfect Grade Unleashed 1/60 RX-78-2 Gundam (Museum Weathered Edition)',
    slug: 'bandai-pg-unleashed-rx-78-2-gundam',
    category: 'Gundam',
    brand: 'Bandai Spirits',
    price: 420,
    discountPrice: 389,
    stock: 2,
    condition: 'Collector Display Assembly / Pristine',
    featured: true,
    newArrival: false,
    rareCollection: true,
    status: 'published',
    mainImage: '/src/assets/images/gundam_pg_unleashed_1793761650084.jpg',
    images: [
      '/src/assets/images/gundam_pg_unleashed_1793761650084.jpg'
    ],
    description: 'The peak of Gunpla engineering. 1/60 scale Perfect Grade Unleashed featuring multi-layered inner frames, metallic electroplated etched parts, LED lighting matrix for chest vents and eyes, precision panel line shading, and museum-grade weathering finish on a stone plinth.',
    specifications: {
      'Manufacturer': 'Bandai Spirits / Gunpla',
      'Model': 'RX-78-2 Gundam (Amuro Ray Custom)',
      'Grade': 'Perfect Grade Unleashed (PGU)',
      'Scale': '1/60',
      'Special Features': 'Full Metal Etching, 3-Phase Armor Hatch Open, RGB LED Core',
      'Height': 'Approx 320mm'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-005',
    name: 'ZHONGKUI "The Sandeai Sovereign" Limited Edition Resin Statue (1/6 Scale)',
    slug: 'zhongkui-sandeai-sovereign-resin-statue',
    category: 'Anime Figures',
    brand: 'ZHONGKUI Atelier',
    price: 680,
    discountPrice: null,
    stock: 4,
    condition: 'Brand New / Numbered Art Certificate',
    featured: true,
    newArrival: true,
    rareCollection: true,
    status: 'published',
    mainImage: '/src/assets/images/anime_resin_statue_1793761649294.jpg',
    images: [
      '/src/assets/images/anime_resin_statue_1793761649294.jpg'
    ],
    description: 'Exclusive artisanal studio sculpture depicting the guardian spirit in contemplative readiness. Cast in premium polystone and PU resin with gold hand-leaf gilding, katana sheath engraving, and genuine dark timber bench presentation base. Limited to 250 pieces worldwide.',
    specifications: {
      'Studio': 'ZHONGKUI Atelier & Guild',
      'Character': 'The Sovereign Master',
      'Scale': '1/6 Studio Scale',
      'Materials': 'High Density Polystone, Resin, Solid Oak Plinth',
      'Worldwide Edition': '250 Numbered Pieces with Gold Embossed COA',
      'Dimensions': '38cm H x 32cm W x 28cm D'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-006',
    name: '1999 Pokémon Base Set 1st Edition Shadowless Charizard PSA 9 MINT',
    slug: '1999-pokemon-base-set-shadowless-charizard-psa-9',
    category: 'Pokémon Cards',
    brand: 'Pokémon TCG',
    price: 12500,
    discountPrice: 11900,
    stock: 1,
    condition: 'PSA 9 Mint',
    featured: false,
    newArrival: false,
    rareCollection: true,
    status: 'published',
    mainImage: '/assets/aistudio/screen_55416fe7.png',
    images: [
      '/assets/aistudio/screen_55416fe7.png'
    ],
    description: 'The foundation stone of vintage card collecting. 1999 English 1st Edition Shadowless Charizard #4/102 in PSA 9 Mint condition. Vibrant coloration, crisp edges, and certified original tamper-proof PSA sonic weld casing.',
    specifications: {
      'Card Name': 'Charizard Holo #4/102',
      'Set': 'Base Set 1st Edition Shadowless',
      'Grading Company': 'PSA',
      'Grade': 'MINT 9',
      'Certification Number': '28941032',
      'Language': 'English'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-007',
    name: 'Hot Wheels RLC Exclusive 1971 Datsun 510 Real Riders Limited Edition',
    slug: 'hot-wheels-rlc-1971-datsun-510',
    category: 'Hot Wheels',
    brand: 'Hot Wheels Red Line Club',
    price: 135,
    discountPrice: 120,
    stock: 6,
    condition: 'Sealed In Original Acrylic Clamshell',
    featured: false,
    newArrival: true,
    rareCollection: false,
    status: 'published',
    mainImage: '/src/assets/images/diecast_lbwk_supercar_1793761647485.jpg',
    images: [
      '/src/assets/images/diecast_lbwk_supercar_1793761647485.jpg'
    ],
    description: 'Spectraflame olive green finish with period-accurate vintage racing livery, opening hood detailing the L16 engine, polished chrome Real Riders 4-spoke wheels, and individual serialized collector hologram.',
    specifications: {
      'Brand': 'Hot Wheels Collectors / Red Line Club (RLC)',
      'Year': '1971',
      'Car Model': 'Datsun 510 Bluebird',
      'Tires': 'Real Riders rubber with chrome racing rims',
      'Scale': '1:64'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-008',
    name: 'Premium Diecast Museum Acrylic Vitrine Case with Dual LED Downlight',
    slug: 'museum-acrylic-vitrine-case-led',
    category: 'Premium Diecast Cars',
    brand: 'ZHONGKUI Display',
    price: 95,
    discountPrice: 85,
    stock: 15,
    condition: 'Brand New',
    featured: false,
    newArrival: true,
    rareCollection: false,
    status: 'published',
    mainImage: '/assets/aistudio/screen_5d4c2460.png',
    images: [
      '/assets/aistudio/screen_5d4c2460.png'
    ],
    description: 'Museum-grade 99% UV-filtering cast acrylic display vitrine engineered specifically for 1:64 and 1:43 diecast cars or PSA card slabs. Features solid slate stone base, micro dual warm 3000K LED spot downlights, and magnetic dust-seal cover.',
    specifications: {
      'Dimensions': '24cm x 16cm x 14cm',
      'UV Protection': '99.2% Museum Grade',
      'Illumination': 'Rechargeable USB-C 3000K Soft Studio Warm LED',
      'Base': 'Matte Honed Black Slate'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Seed initial database if empty
function initializeDatabase() {
  const products = readJson<Product[]>('products.json', []);
  if (products.length === 0) {
    writeJson('products.json', INITIAL_PRODUCTS);
  }
  const users = readJson<User[]>('users.json', []);
  if (users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('ZhongkuiAdmin2026!', salt);
    users.push({
      id: 'admin-vchea',
      name: 'ZHONGKUI Curator (Vchea)',
      email: 'vchea2065@gmail.com',
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    writeJson('users.json', users);
  }
  readJson('orders.json', []);
}

initializeDatabase();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `zhongkui-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Only JPG, JPEG, PNG, and WEBP are supported.'));
    }
  }
});

export async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Static files for uploads and user public assets
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

  // Session / Token helper (lightweight signed token or basic bearer auth)
  function getAuthUser(req: Request): User | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, email] = decoded.split(':');
      const users = readJson<User[]>('users.json', []);
      return users.find(u => u.id === userId && u.email === email) || null;
    } catch {
      return null;
    }
  }

  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Access forbidden: Administrator privileges required.' });
      return;
    }
    (req as any).user = user;
    next();
  }

  // ----------------------------------------------------
  // API: System & Admin Setup
  // ----------------------------------------------------
  app.get('/api/admin/status', (_req, res) => {
    const users = readJson<User[]>('users.json', []);
    const adminExists = users.some(u => u.role === 'admin');
    res.json({
      isConfigured: adminExists,
      storeName: 'ZHONGKUI',
      version: '1.0.0'
    });
  });

  app.post('/api/admin/setup', async (req, res) => {
    const { name, email, password, pin } = req.body;
    const users = readJson<User[]>('users.json', []);
    const adminExists = users.some(u => u.role === 'admin');

    if (adminExists) {
      res.status(400).json({ error: 'Admin has already been configured. Please login.' });
      return;
    }

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin: User = {
      id: 'admin-' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    users.push(newAdmin);
    writeJson('users.json', users);

    const token = Buffer.from(`${newAdmin.id}:${newAdmin.email}`).toString('base64');
    res.json({
      message: 'Admin account created successfully.',
      token,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  });

  // ----------------------------------------------------
  // API: Authentication
  // ----------------------------------------------------
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const users = readJson<User[]>('users.json', []);
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: 'cust-' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      passwordHash,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJson('users.json', users);

    const token = Buffer.from(`${newUser.id}:${newUser.email}`).toString('base64');
    res.json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const users = readJson<User[]>('users.json', []);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
      return;
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  });

  // ----------------------------------------------------
  // API: Products
  // ----------------------------------------------------
  app.get('/api/products', (req, res) => {
    const products = readJson<Product[]>('products.json', []);
    const { category, brand, featured, newArrival, rare, search, status, sort } = req.query;

    let filtered = products;

    // Filter by status (unless admin asks specifically, default only published or sold_out)
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      filtered = filtered.filter(p => p.status === 'published' || p.status === 'sold_out');
    } else if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (brand) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
    }

    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    if (newArrival === 'true') {
      filtered = filtered.filter(p => p.newArrival);
    }

    if (rare === 'true') {
      filtered = filtered.filter(p => p.rareCollection);
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'price-low') {
      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const products = readJson<Product[]>('products.json', []);
    const found = products.find(p => p.id === req.params.id || p.slug === req.params.id);
    if (!found) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(found);
  });

  app.post('/api/products', requireAdmin, (req, res) => {
    const {
      name,
      category,
      brand,
      price,
      discountPrice,
      stock,
      condition,
      featured,
      newArrival,
      rareCollection,
      status,
      mainImage,
      images,
      description,
      specifications
    } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ error: 'Name, price, and category are required' });
      return;
    }

    const products = readJson<Product[]>('products.json', []);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name,
      slug,
      category,
      brand: brand || 'ZHONGKUI Curated',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock ?? 1),
      condition: condition || 'Brand New',
      featured: Boolean(featured),
      newArrival: Boolean(newArrival),
      rareCollection: Boolean(rareCollection),
      status: status || 'published',
      mainImage: mainImage || (images && images.length > 0 ? images[0] : '/assets/aistudio/screen_55416fe7.png'),
      images: Array.isArray(images) && images.length > 0 ? images : [mainImage || '/assets/aistudio/screen_55416fe7.png'],
      description: description || '',
      specifications: specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    writeJson('products.json', products);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', requireAdmin, (req, res) => {
    const products = readJson<Product[]>('products.json', []);
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const existing = products[index];
    const updated: Product = {
      ...existing,
      ...req.body,
      id: existing.id,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      discountPrice: req.body.discountPrice !== undefined ? (req.body.discountPrice ? Number(req.body.discountPrice) : null) : existing.discountPrice,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      updatedAt: new Date().toISOString()
    };

    // If stock is 0 and status is published, auto adjust or keep as marked
    if (updated.stock <= 0 && updated.status === 'published') {
      updated.status = 'sold_out';
    }

    products[index] = updated;
    writeJson('products.json', products);
    res.json(updated);
  });

  app.delete('/api/products/:id', requireAdmin, (req, res) => {
    let products = readJson<Product[]>('products.json', []);
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    products = products.filter(p => p.id !== req.params.id);
    writeJson('products.json', products);
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  });

  // ----------------------------------------------------
  // API: File Uploads (Multer + Storage)
  // ----------------------------------------------------
  app.post('/api/upload', upload.array('images', 10), (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const uploadedUrls = files.map(file => {
      return {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      };
    });

    res.json({
      message: 'Images uploaded successfully',
      urls: uploadedUrls.map(u => u.url),
      files: uploadedUrls
    });
  });

  app.delete('/api/upload/:filename', requireAdmin, (req, res) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });

  // ----------------------------------------------------
  // API: Orders & Checkout
  // ----------------------------------------------------
  app.post('/api/orders', (req, res) => {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      country,
      notes,
      paymentMethod,
      items
    } = req.body;

    if (!customerName || !phone || !email || !address || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Missing required checkout information or empty cart.' });
      return;
    }

    const products = readJson<Product[]>('products.json', []);

    // Check stock availability safely
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        res.status(400).json({ error: `Product ${item.name} not found.` });
        return;
      }
      if (prod.stock < item.quantity) {
        res.status(400).json({
          error: `Insufficient stock for "${prod.name}". Available: ${prod.stock}, requested: ${item.quantity}.`
        });
        return;
      }
    }

    // Decrement stock safe update
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId)!;
      prod.stock -= item.quantity;
      if (prod.stock <= 0) {
        prod.status = 'sold_out';
      }
      prod.updatedAt = new Date().toISOString();
    }
    writeJson('products.json', products);

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 300 ? 0 : 25; // Free premium insured shipping over $300
    const total = subtotal + shippingFee;

    const orderNumber = 'ZK-' + Math.floor(100000 + Math.random() * 900000);
    const user = getAuthUser(req);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerId: user ? user.id : undefined,
      customerName,
      email,
      phone,
      address,
      city: city || 'Phnom Penh',
      country: country || 'Cambodia',
      notes: notes || '',
      paymentMethod: paymentMethod || 'ABA_BANK',
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'pending' : 'pending',
      items,
      subtotal,
      shippingFee,
      total,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = readJson<Order[]>('orders.json', []);
    orders.unshift(newOrder);
    writeJson('orders.json', orders);

    res.status(201).json(newOrder);
  });

  app.get('/api/orders', (req, res) => {
    const user = getAuthUser(req);
    const orders = readJson<Order[]>('orders.json', []);

    if (user && user.role === 'admin') {
      res.json(orders);
      return;
    }

    if (user) {
      // Customer orders
      const userOrders = orders.filter(o => o.customerId === user.id || o.email === user.email);
      res.json(userOrders);
      return;
    }

    res.status(401).json({ error: 'Authentication required to view orders.' });
  });

  app.get('/api/orders/:id', (req, res) => {
    const orders = readJson<Order[]>('orders.json', []);
    const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  });

  app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
    const { status, paymentStatus } = req.body;
    const orders = readJson<Order[]>('orders.json', []);
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    writeJson('orders.json', orders);
    res.json(order);
  });

  // ----------------------------------------------------
  // API: Admin Overview Statistics
  // ----------------------------------------------------
  app.get('/api/stats', requireAdmin, (_req, res) => {
    const products = readJson<Product[]>('products.json', []);
    const orders = readJson<Order[]>('orders.json', []);
    const users = readJson<User[]>('users.json', []);

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStockProducts = products.filter(p => p.stock <= 3);
    const soldOutProducts = products.filter(p => p.stock === 0 || p.status === 'sold_out');

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.filter(u => u.role === 'customer').length,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      soldOutCount: soldOutProducts.length,
      recentOrders: orders.slice(0, 5),
      lowStockItems: lowStockProducts.slice(0, 5)
    });
  });

  // ----------------------------------------------------
  // API: Categories list
  // ----------------------------------------------------
  app.get('/api/categories', (_req, res) => {
    res.json([
      { id: 'cat-1', name: 'Pokémon Cards', slug: 'pokemon-cards', count: 12 },
      { id: 'cat-2', name: 'PSA Graded Cards', slug: 'psa-graded', count: 8 },
      { id: 'cat-3', name: 'Premium Diecast Cars', slug: 'diecast', count: 14 },
      { id: 'cat-4', name: 'INNO64', slug: 'inno64', count: 6 },
      { id: 'cat-5', name: 'LBWK', slug: 'lbwk', count: 5 },
      { id: 'cat-6', name: 'Gundam', slug: 'gundam', count: 7 },
      { id: 'cat-7', name: 'Anime Figures', slug: 'anime-figures', count: 9 }
    ]);
  });

  // --- Vite Dev Middleware or Production Static Fallback ---
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // --- Start Server with Explicit Startup Logging ---
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// Invoke the server starter
createServer().catch(err => {
  console.error('Failed to start server:', err);
});
