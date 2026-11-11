import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminSetup } from './pages/admin/AdminSetup';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminImageManager } from './pages/admin/AdminImageManager';
import { AdminSettings } from './pages/admin/AdminSettings';
import { Product, Order } from './types';

function MainApp() {
  const { user, isAdmin, isConfigured } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin' || window.location.pathname.includes('/admin')) return 'admin';
    }
    return 'home';
  });
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Global Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') setCurrentPage('admin');
      else if (hash === 'shop') setCurrentPage('shop');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.location.hash = 'admin';
    } else if (page === 'home') {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (productId: string) => {
    const token = localStorage.getItem('zk_token');
    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchProducts();
    }
  };

  // If viewing admin section
  if (currentPage === 'admin' || currentPage === 'admin-dashboard') {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between">
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
          <AuthPage
            initialMode="login"
            isAdminLogin={true}
            onNavigate={handleNavigate}
          />
          <Footer onNavigate={handleNavigate} />
        </div>
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => {
          if (tab === 'add-product') {
            setEditingProduct(null);
          }
          setAdminTab(tab);
        }}
        onNavigateHome={() => handleNavigate('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={(tab) => setAdminTab(tab)}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setAdminTab('edit-product');
            }}
          />
        )}

        {adminTab === 'products' && (
          <AdminProducts
            products={products}
            onAddProduct={() => {
              setEditingProduct(null);
              setAdminTab('add-product');
            }}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setAdminTab('edit-product');
            }}
            onDeleteProduct={handleDeleteProduct}
            onViewProductOnStore={(id) => handleNavigate(`product-${id}`)}
            onRefreshProducts={fetchProducts}
          />
        )}

        {(adminTab === 'add-product' || adminTab === 'edit-product') && (
          <AdminProductForm
            initialProduct={adminTab === 'edit-product' ? editingProduct : null}
            onCancel={() => setAdminTab('products')}
            onSaved={() => {
              fetchProducts();
              setAdminTab('products');
            }}
          />
        )}

        {adminTab === 'categories' && (
          <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-[#151515]">
              ACTIVE STORE CATEGORIES
            </h3>
            <p className="text-xs text-[#858585]">
              Categories are automatically indexed and displayed based on active catalog items.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                'Pokémon Cards',
                'PSA Graded Cards',
                'Premium Diecast Cars',
                'INNO64',
                'LBWK',
                'Hot Wheels',
                'Gundam',
                'Anime Figures',
                'Rare Collection'
              ].map((c) => {
                const count = products.filter(p => p.category === c).length;
                return (
                  <div key={c} className="p-3 bg-[#F7F7F5] border border-[#151515]/10 flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#151515]">{c}</span>
                    <span className="font-mono text-[#858585]">{count} items</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {adminTab === 'images' && <AdminImageManager />}

        {adminTab === 'orders' && <AdminOrders />}

        {adminTab === 'customers' && (
          <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-[#151515]">
              REGISTERED COLLECTOR CLIENTS
            </h3>
            <p className="text-xs text-[#858585]">
              Client account directory with order frequency and verification credentials.
            </p>
            <div className="border border-[#151515]/10 divide-y divide-[#151515]/5 text-xs">
              <div className="p-3.5 flex justify-between items-center bg-[#F7F7F5] font-mono text-[10px] text-[#858585] uppercase">
                <span>Client Name & Email</span>
                <span>Role</span>
              </div>
              <div className="p-3.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-[#151515] block">{user?.name} (You)</span>
                  <span className="text-[11px] text-[#858585] font-mono">{user?.email}</span>
                </div>
                <span className="font-mono text-[#B99A5B] font-bold uppercase">Store Administrator</span>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'inventory' && (
          <AdminInventory products={products} onRefreshProducts={fetchProducts} />
        )}

        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Customer Facing Storefront View
  const isProductDetail = currentPage.startsWith('product-');
  const productId = isProductDetail ? currentPage.replace('product-', '') : '';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#151515]">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={handleNavigate}
      />

      {/* Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            products={products}
            initialCategory="All"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-pokemon-cards' && (
          <ShopPage
            products={products}
            initialCategory="Pokémon Cards"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-psa-graded' && (
          <ShopPage
            products={products}
            initialCategory="PSA Graded Cards"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-premium-diecast' && (
          <ShopPage
            products={products}
            initialCategory="Premium Diecast Cars"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-inno64' && (
          <ShopPage
            products={products}
            initialCategory="INNO64"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-lbwk' && (
          <ShopPage
            products={products}
            initialCategory="LBWK"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-hot-wheels' && (
          <ShopPage
            products={products}
            initialCategory="Hot Wheels"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-gundam' && (
          <ShopPage
            products={products}
            initialCategory="Gundam"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-anime-figures' && (
          <ShopPage
            products={products}
            initialCategory="Anime Figures"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-rare' && (
          <ShopPage
            products={products}
            initialCategory="Rare Collection"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'category-new-arrivals' && (
          <ShopPage
            products={products}
            initialCategory="New Arrivals"
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {isProductDetail && (
          <ProductDetailPage
            productId={productId}
            products={products}
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderPlaced={() => fetchProducts()}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'wishlist' && (
          <AccountPage
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'login' && (
          <AuthPage initialMode="login" onNavigate={handleNavigate} />
        )}

        {currentPage === 'register' && (
          <AuthPage initialMode="register" onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin-login' && (
          <AuthPage initialMode="login" isAdminLogin={true} onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin-setup' && (
          <AdminSetup onNavigate={handleNavigate} />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
