import React from 'react';
import { Shield, Lock, Award, Package, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#151515] text-[#F7F7F5] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Pillars of Collector Assurance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xs bg-white/5 border border-white/10 text-[#B99A5B] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Guaranteed Provenance</h4>
              <p className="text-[11px] text-[#858585] mt-1 leading-relaxed">
                100% lifetime authenticity guarantee. Every card and diecast verified by certified specialists.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xs bg-white/5 border border-white/10 text-[#B99A5B] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Archival Preservation</h4>
              <p className="text-[11px] text-[#858585] mt-1 leading-relaxed">
                99.2% UV-filtering acrylic vaulting and temperature-controlled storage before dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xs bg-white/5 border border-white/10 text-[#B99A5B] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Armored Packaging</h4>
              <p className="text-[11px] text-[#858585] mt-1 leading-relaxed">
                Triple-wall corrugated crush-proof boxes with custom foam inserts and tamper-evident seals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xs bg-white/5 border border-white/10 text-[#B99A5B] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Concierge</h4>
              <p className="text-[11px] text-[#858585] mt-1 leading-relaxed">
                Personalized collector acquisition requests for rare 1st edition Pokémon slabs and limited diecast.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/logo_zhong_kui_2849056d.png"
                alt="ZHONGKUI"
                className="w-10 h-10 rounded-full object-cover border border-[#B99A5B]"
              />
              <div>
                <span className="font-cinzel text-xl font-bold tracking-widest text-white">ZHONGKUI</span>
                <span className="text-[9px] font-mono tracking-widest block text-[#B99A5B]">鐘馗 · MASTER ARCHIVE</span>
              </div>
            </div>

            <p className="text-xs text-[#858585] leading-relaxed max-w-sm">
              Named after the legendary guardian of treasures, ZHONGKUI curates, preserves, and delivers the world&apos;s most exceptional Pokémon trading cards, scale miniature automobiles, and Japanese pop-culture masterpieces.
            </p>

            <div className="text-xs font-mono text-[#B99A5B] tracking-wider pt-1">
              COLLECT. PRESERVE. DISPLAY.
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h5 className="font-cinzel text-xs font-bold tracking-wider text-white uppercase mb-4">
              COLLECTIONS
            </h5>
            <ul className="space-y-2 text-xs text-[#858585]">
              <li>
                <button onClick={() => onNavigate('category-pokemon-cards')} className="hover:text-white transition-colors">
                  Pokémon Trading Cards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-psa-graded')} className="hover:text-white transition-colors">
                  PSA Graded Slabs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-inno64')} className="hover:text-white transition-colors">
                  INNO64 Diecast
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-lbwk')} className="hover:text-white transition-colors">
                  LBWK / Liberty Walk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-hot-wheels')} className="hover:text-white transition-colors">
                  Hot Wheels RLC
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-gundam')} className="hover:text-white transition-colors">
                  Bandai Gundam Models
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-rare')} className="hover:text-white transition-colors">
                  Rare & Vault Edition
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div>
            <h5 className="font-cinzel text-xs font-bold tracking-wider text-white uppercase mb-4">
              SERVICES
            </h5>
            <ul className="space-y-2 text-xs text-[#858585]">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Concierge & Grading Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Authenticity Verification & Vault Care
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Cambodia Payments & Trust */}
          <div>
            <h5 className="font-cinzel text-xs font-bold tracking-wider text-white uppercase mb-4">
              PAYMENTS & LOGISTICS
            </h5>
            <p className="text-[11px] text-[#858585] mb-3">
              Official Cambodia local banking settlement & global express courier:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-white/90">
              <span className="bg-white/10 px-2 py-1 rounded-xs border border-white/10">ABA Bank</span>
              <span className="bg-[#E01A22]/80 text-white px-2 py-1 rounded-xs">KHQR</span>
              <span className="bg-white/10 px-2 py-1 rounded-xs border border-white/10">Bakong</span>
              <span className="bg-white/10 px-2 py-1 rounded-xs border border-white/10">Bank Wire</span>
              <span className="bg-white/10 px-2 py-1 rounded-xs border border-white/10">COD (Phnom Penh)</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-[#858585]">
              Insured courier delivery via DHL Express & Cambodia Post EMS.
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Fine Print */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#858585]">
          <div>
            &copy; {new Date().getFullYear()} ZHONGKUI COLLECTIBLES. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>PSA / BGS / CGC Registered Affiliate</span>
            <span>Liberty Walk Official Dealer</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-[#B99A5B] text-[10px] font-mono tracking-wider transition-colors"
            >
              ADMIN ACCESS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
