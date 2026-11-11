import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Boxes,
  Settings,
  LogOut,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  children
}) => {
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'images', label: 'Image Manager', icon: ImageIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F0F0ED] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#151515] text-[#F7F7F5] flex flex-col justify-between shrink-0 border-r border-white/10">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#151515] border border-[#B99A5B] flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/logo_zhong_kui_2849056d.png"
                alt="ZHONGKUI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-cinzel text-base font-bold tracking-widest text-white">ZHONGKUI</span>
              <span className="text-[9px] font-mono tracking-wider text-[#B99A5B] block">ADMINISTRATOR</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#B99A5B] text-[#151515] font-bold shadow-xs'
                      : 'text-[#858585] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Exit Storefront */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="px-3 py-2 bg-white/5 border border-white/10 text-xs">
            <span className="text-[10px] text-[#858585] font-mono block">LOGGED IN AS</span>
            <span className="font-semibold text-white truncate block">{user?.name}</span>
            <span className="text-[10px] text-[#B99A5B] font-mono">{user?.email}</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#858585] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              logout();
              onNavigateHome();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#151515]/10 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#B99A5B]" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
              ZHONGKUI INTERNAL VAULT MANAGEMENT SYSTEM
            </span>
          </div>
          <div className="text-xs font-mono text-[#858585]">
            Live Catalog · Immediate Sync
          </div>
        </header>

        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
