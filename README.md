# ZHONGKUI — Premium Collectibles E-Commerce Platform

> **COLLECT. PRESERVE. DISPLAY.**

A complete, production-grade e-commerce application for rare Pokémon cards, PSA graded slabs, INNO64 & LBWK diecast models, Gundam, and Japanese pop-culture masterpieces.

---

## Key Highlights

- **Japanese-Inspired Luxury Aesthetics**: Tailored palette (`#151515`, `#B99A5B`, `#F7F7F5`, `#FFFFFF`, `#858585`), refined typography (Cinzel & Plus Jakarta Sans), and zero-slop restraint.
- **Museum Visuals**: Features high-fidelity photography of PSA 10 Gem Mint slabs, museum showcase vitrines, and custom 1:64 diecasts.
- **Full-Stack REST Architecture**: Express.js server providing authenticated API endpoints for catalog management, stock updates, user sessions, and orders.
- **Real Image Upload System**: Powered by Multer (`/api/upload`) with file validation (JPG/PNG/WEBP), multi-image upload, live preview, cover selection, and reordering.
- **Cambodia Banking & Settlement**: Dedicated ABA Bank & Bakong KHQR dynamic QR modal with transaction verification simulation, account number copying, and Cash on Delivery (COD).
- **Secure Administrator Setup**: No hardcoded public admin credentials. The store owner initializes root admin credentials upon first setup with salted bcrypt password hashing.
- **Safe Inventory & Anti-Overselling**: Strict real-time stock deductions upon checkout confirmation to prevent overselling of rare 1-of-1 vault artifacts.
- **Customer Portal**: Registration, sign-in, order fulfillment tracking progression, and saved wishlist.

---

## Architecture

```
/
├── server.ts               # Express full-stack API & Vite middleware
├── public/
│   ├── assets/aistudio/    # Brand emblems & museum showcase assets
│   └── uploads/            # Multer persistent image storage
├── data/
│   ├── products.json       # Product catalog with specifications
│   ├── orders.json         # Customer orders & shipment records
│   └── users.json          # Authenticated customers & administrators
├── src/
│   ├── components/         # Navbar, Footer, CartDrawer, SearchModal, ProductCard, KhqrModal
│   ├── context/            # AuthContext, CartContext, WishlistContext
│   ├── pages/              # Home, Shop, ProductDetail, Cart, Checkout, Account, About, Contact
│   └── pages/admin/        # Dashboard, Products, Add/Edit Form, Inventory, Images, Settings, Setup
```

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Initialize Admin Account**:
   - Navigate to `/admin` or click **"SETUP STORE"** in the top bar.
   - Enter your Administrator name, email, and master password.
   - Access the complete private dashboard to manage products, upload pictures, adjust stock, and review customer orders.
