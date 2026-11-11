import React from 'react';
import { ArrowRight, Sparkles, Shield, Eye, Flame, Compass } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onNavigate, onQuickView }) => {
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const rareProducts = products.filter(p => p.rareCollection).slice(0, 3);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);

  const categories = [
    {
      title: 'Pokémon Cards',
      id: 'category-pokemon-cards',
      image: '/assets/aistudio/screen_55416fe7.png',
      count: 'Vintage & Modern'
    },
    {
      title: 'PSA Graded Slabs',
      id: 'category-psa-graded',
      image: '/assets/aistudio/screen_55416fe7.png',
      count: 'Gem Mint 10 Archival'
    },
    {
      title: 'INNO64 Collection',
      id: 'category-inno64',
      image: '/src/assets/images/diecast_inno64_gtr_1793761649676.jpg',
      count: '1:64 Precision Scale'
    },
    {
      title: 'LBWK Liberty Walk',
      id: 'category-lbwk',
      image: '/src/assets/images/diecast_lbwk_supercar_1793761647485.jpg',
      count: 'Official Authorized'
    },
    {
      title: 'Bandai Gundam',
      id: 'category-gundam',
      image: '/src/assets/images/gundam_pg_unleashed_1793761650084.jpg',
      count: 'PG Unleashed & MGEX'
    },
    {
      title: 'Anime Statues',
      id: 'category-anime-figures',
      image: '/src/assets/images/anime_resin_statue_1793761649294.jpg',
      count: 'Limited Resin Sculptures'
    },
    {
      title: 'Hot Wheels RLC',
      id: 'category-hot-wheels',
      image: '/assets/aistudio/screen_5d4c2460.png',
      count: 'Real Riders Limited'
    },
    {
      title: 'Rare Vault',
      id: 'category-rare',
      image: '/assets/aistudio/screen_5d4c2460.png',
      count: 'Museum Provenance'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative bg-[#151515] text-[#F7F7F5] overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#B99A5B_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#B99A5B] uppercase px-3 py-1 bg-white/5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>PREMIER COLLECTIBLES GUILD</span>
              </div>

              <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] [text-wrap:balance]">
                COLLECT WHAT MATTERS.
              </h1>

              <p className="text-sm sm:text-base text-[#858585] max-w-xl leading-relaxed">
                Discover rare Pokémon cards, PSA graded gems, premium diecast models, and exclusive collectibles preserved with museum-grade care at ZHONGKUI.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-8 py-3.5 bg-[#B99A5B] hover:bg-[#a6894c] text-[#151515] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all cursor-pointer group"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('category-rare')}
                  className="px-8 py-3.5 bg-transparent hover:bg-white/5 text-white font-semibold text-xs uppercase tracking-widest border border-white/20 transition-all cursor-pointer"
                >
                  THE RARE VAULT
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs font-mono text-[#858585]">
                <div>
                  <span className="text-white font-bold block text-sm">100%</span>
                  <span>Authenticity Guaranteed</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm">PSA · CGC</span>
                  <span>Official Graded Slabs</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm">KHQR & ABA</span>
                  <span>Cambodia Settlement</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Museum Showcase Display */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative gold hairline backdrop frame */}
                <div className="absolute -inset-1 border border-[#B99A5B]/30 rounded-xs -rotate-1 pointer-events-none" />
                
                {/* Showcase Image Container */}
                <div className="relative bg-[#1f1f1f] border border-white/15 p-2 overflow-hidden shadow-2xl group">
                  <img
                    src="/assets/aistudio/screen_5d4c2460.png"
                    alt="ZHONGKUI Museum Display with PSA 10 Charizard & Liberty Walk GT-R"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  
                  {/* Floating Plaque / Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#151515]/90 backdrop-blur-md border border-white/10 p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#B99A5B] block">VAULT EXHIBIT #01</span>
                      <span className="font-semibold text-white">Charizard Holo & LBWK GT-R Miniature Showcase</span>
                    </div>
                    <button
                      onClick={() => onNavigate('category-psa-graded')}
                      className="p-2 bg-white/10 hover:bg-[#B99A5B] hover:text-[#151515] text-white transition-colors cursor-pointer"
                      title="Inspect piece"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORY VISUAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#151515]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
              CURATED ARCHIVES
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
              EXPLORE BY DISCIPLINE
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold tracking-wider uppercase text-[#151515] hover:text-[#B99A5B] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(cat.id)}
              className="group relative h-48 md:h-56 bg-[#151515] overflow-hidden border border-[#151515]/10 hover:border-[#B99A5B] transition-all cursor-pointer shadow-xs"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99A5B] block">
                  {cat.count}
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#B99A5B] transition-colors">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#151515]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
              HIGHLIGHTS
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
              FEATURED ACQUISITIONS
            </h2>
          </div>
          <p className="text-xs text-[#858585] max-w-sm">
            Hand-selected by our head curator for rarity, condition rating, and investment potential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* RARE COLLECTION (DARK MUSEUM VAULT SECTION) */}
      <section className="bg-[#151515] text-[#F7F7F5] py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B99A5B] uppercase tracking-widest mb-2">
                <Flame className="w-4 h-4 text-[#B99A5B]" />
                <span>RESTRICTED ARCHIVES</span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-white">
                THE RARE COLLECTION
              </h2>
            </div>
            <p className="text-xs text-[#858585] max-w-md leading-relaxed">
              Pinnacle grade 1st edition Pokémon cards, numbered resin sculptures, and limited diecast models held in vault preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {rareProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate(`product-${prod.id}`)}
                className="group bg-[#1e1e1e] border border-white/10 hover:border-[#B99A5B] transition-all p-4 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 w-full bg-[#121212] overflow-hidden p-4 flex items-center justify-center">
                  <img
                    src={prod.mainImage}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 text-[10px] font-mono uppercase bg-[#B99A5B] text-[#151515] font-bold px-2 py-0.5">
                    {prod.condition}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="text-[10px] font-mono text-[#B99A5B] uppercase tracking-widest">
                    {prod.brand} · {prod.category}
                  </div>
                  <h3 className="font-cinzel text-sm font-bold text-white group-hover:text-[#B99A5B] transition-colors line-clamp-2">
                    {prod.name}
                  </h3>
                  <div className="pt-2 flex items-baseline justify-between border-t border-white/10">
                    <span className="text-base font-mono font-bold text-white">
                      ${(prod.discountPrice ?? prod.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-[#858585] group-hover:text-white flex items-center gap-1 transition-colors">
                      <span>View Provenance</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#151515]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
              FRESH FROM JAPAN & VAULTS
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
              NEW ARRIVALS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('category-new-arrivals')}
            className="text-xs font-semibold tracking-wider uppercase text-[#151515] hover:text-[#B99A5B] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>See All Recent Additions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* HERITAGE & PHILOSOPHY: "MORE THAN COLLECTING. IT'S A PASSION." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#151515]/10 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-[#B99A5B]/30 p-2 flex items-center justify-center">
                <img
                  src="/assets/aistudio/logo_zhong_kui_2849056d.png"
                  alt="Zhong Kui the Guardian"
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
                <div className="absolute -bottom-3 bg-[#151515] text-[#B99A5B] text-[10px] font-mono tracking-widest px-4 py-1 uppercase border border-[#B99A5B]">
                  GUARDIAN OF TREASURES
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block">
                ABOUT ZHONGKUI
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
                &quot;MORE THAN COLLECTING. IT&apos;S A PASSION.&quot;
              </h2>
              <p className="text-xs sm:text-sm text-[#858585] leading-relaxed">
                In Eastern folklore, <strong>Zhong Kui</strong> is the celestial guardian and master subduer of chaotic spirits, standing as the eternal protector of peace and treasured possessions.
              </p>
              <p className="text-xs sm:text-sm text-[#858585] leading-relaxed">
                At ZHONGKUI, we carry that same spirit into the art of modern collecting. Whether it is a holy grail 1st Edition Charizard sealed in a sonically welded PSA casing or a precision 1:64 Liberty Walk GT-R with hand-riveted fender craftsmanship, each artifact represents history, design mastery, and emotion.
              </p>
              <div className="pt-2 flex flex-wrap gap-6 text-xs font-mono text-[#151515]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#B99A5B]" />
                  <span>Curated Authenticity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#B99A5B]" />
                  <span>Direct Japan Sourcing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#B99A5B]" />
                  <span>Archival Grade Pedestals</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
