import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User as UserIcon, Menu, X, Shield, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAdmin, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Shop All', id: 'shop' },
    { label: 'Pokémon', id: 'category-pokemon-cards' },
    { label: 'Diecast', id: 'category-premium-diecast' },
    { label: 'Gundam', id: 'category-gundam' },
    { label: 'Rare Collection', id: 'category-rare' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#151515] text-[#F7F7F5] text-[11px] font-mono tracking-wider py-1.5 px-4 text-center border-b border-white/10 flex items-center justify-between max-w-full">
        <div className="hidden md:block w-32 text-left text-[#B99A5B] font-semibold text-[10px]">
          COLLECT. PRESERVE. DISPLAY.
        </div>
        <div className="flex-1 text-center truncate">
          <span>COMPLIMENTARY INSURED COURIER ON VAULT ORDERS OVER $300 USD · ABA BANK & KHQR ACCEPTED</span>
        </div>
        <div className="hidden md:flex items-center gap-3 w-32 justify-end text-[10px] text-[#858585]">
          {isAdmin ? (
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#B99A5B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3" />
              <span>ADMIN PORTAL</span>
            </button>
          ) : !isConfigured ? (
            <button
              onClick={() => onNavigate('admin-setup')}
              className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>SETUP STORE</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('admin-login')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ADMIN
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Header - Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#F7F7F5]/95 backdrop-blur-md border-b border-[#151515]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single element Brand Wordmark with Logo Icon */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group select-none"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B99A5B]/40 bg-[#151515] flex items-center justify-center p-0.5 shadow-sm group-hover:border-[#B99A5B] transition-colors">
              <img
                src="/assets/aistudio/logo_zhong_kui_2849056d.png"
                alt="ZHONGKUI Emblem"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to text initials if asset is unavailable
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl md:text-2xl font-black tracking-widest text-[#151515] group-hover:text-[#B99A5B] transition-colors">
                ZHONGKUI
              </span>
              <span className="text-[8px] font-mono tracking-widest uppercase text-[#858585] -mt-0.5">
                PREMIUM COLLECTIBLES
              </span>
            </div>
          </div>

          {/* Zone 2: 4-6 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#151515]/80">
            {navLinks.map((link) => {
              const active = currentPage === link.id || (link.id.startsWith('category-') && currentPage === link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'text-[#B99A5B] font-bold'
                      : 'hover:text-[#151515]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B99A5B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Wishlist, Cart, Account, Mobile Menu) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#151515]/80 hover:text-[#151515] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              title="Search catalog"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-[#151515]/80 hover:text-[#151515] hover:bg-black/5 rounded-full transition-colors relative cursor-pointer"
              title="Saved items"
              aria-label="Saved items"
            >
              <Heart className="w-4 h-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B99A5B] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="py-1.5 px-3 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-semibold tracking-wider flex items-center gap-2 rounded-xs shadow-xs transition-colors cursor-pointer"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{itemCount}</span>
            </button>

            {/* User Account Button */}
            <button
              onClick={() => {
                if (user) {
                  onNavigate('account');
                } else {
                  onNavigate('login');
                }
              }}
              className="p-2 text-[#151515]/80 hover:text-[#151515] hover:bg-black/5 rounded-full transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={user ? user.name : 'Sign In'}
            >
              <UserIcon className="w-4 h-4" />
              {user && (
                <span className="max-w-[80px] truncate text-xs">{user.name.split(' ')[0]}</span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#151515] lg:hidden cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#151515]/10 bg-white py-4 px-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="text-left text-sm font-semibold tracking-wider uppercase text-[#151515] py-2 border-b border-[#151515]/5 hover:text-[#B99A5B] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleLinkClick('about')}
                  className="text-left text-xs text-[#858585] py-1 hover:text-[#151515]"
                >
                  About ZHONGKUI
                </button>
                <button
                  onClick={() => handleLinkClick('contact')}
                  className="text-left text-xs text-[#858585] py-1 hover:text-[#151515]"
                >
                  Contact & Concierge
                </button>
                
                {user ? (
                  <button
                    onClick={() => handleLinkClick('account')}
                    className="text-left text-xs font-semibold text-[#151515] py-1 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>My Account ({user.name})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleLinkClick('login')}
                    className="text-left text-xs font-semibold text-[#151515] py-1"
                  >
                    Sign In / Register
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleLinkClick('admin')}
                    className="text-left text-xs font-bold text-[#B99A5B] py-1 flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Control Center</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
