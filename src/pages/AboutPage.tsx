import React from 'react';
import { Shield, Sparkles, Compass, Award, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner */}
      <section className="bg-[#151515] text-[#F7F7F5] py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#B99A5B] uppercase">
            <Sparkles className="w-4 h-4 text-[#B99A5B]" />
            <span>HERITAGE & ARCHIVE</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white">
            MORE THAN COLLECTING. IT&apos;S A PASSION.
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] max-w-xl mx-auto leading-relaxed">
            Founded on the ideals of preservation, authentic lineage, and museum-grade appreciation for rare cultural artifacts.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 rounded-full border-2 border-[#B99A5B]/40 p-2 bg-[#151515] flex items-center justify-center shadow-2xl">
              <img
                src="/assets/aistudio/logo_zhong_kui_2849056d.png"
                alt="Zhong Kui the Guardian"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-3 bg-[#151515] text-[#B99A5B] text-[10px] font-mono tracking-widest px-4 py-1 uppercase border border-[#B99A5B]">
                THE GUARDIAN ETHOS
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-[#858585] leading-relaxed">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block">
              THE STORY OF ZHONGKUI (鐘馗)
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-[#151515]">
              SAFEGUARDING THE SACRED OBJECT
            </h2>
            <p>
              In traditional folklore, <strong>Zhong Kui</strong> is the revered demon-queller and celestial guardian who wards off misfortune and fiercely protects family sanctums and treasured treasures.
            </p>
            <p>
              In modern collecting, rare items face their own dangers: fading from ultraviolet sunlight, micro-scratches from mishandling, fraudulent counterfeit print runs, and careless transport.
            </p>
            <p>
              ZHONGKUI was created to be the modern collector&apos;s sanctuary. We safeguard vintage 1996–2003 Japanese Pokémon cards in tamper-evident sonic-welded slabs, preserve limited INNO64 and Liberty Walk diecast scale models, and curate authentic Japanese Gunpla and resin statues with scientific archival standards.
            </p>
          </div>

        </div>
      </section>

      {/* Three Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#151515]/10 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#F7F7F5] border border-[#151515]/10 flex items-center justify-center text-[#B99A5B]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#151515]">1. ABSOLUTE PROVENANCE</h3>
            <p className="text-xs text-[#858585] leading-relaxed">
              Every card is cross-examined against PSA, BGS, and CGC public registry serial databases before entering our inventory. We guarantee 100% lifetime authenticity.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#F7F7F5] border border-[#151515]/10 flex items-center justify-center text-[#B99A5B]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#151515]">2. DIRECT TOKYO & NAGOYA SOURCING</h3>
            <p className="text-xs text-[#858585] leading-relaxed">
              Our scouting specialists work directly on the ground in Akihabara, Nakano Broadway, and Liberty Walk headquarters in Aichi to obtain factory-sealed rarities.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#F7F7F5] border border-[#151515]/10 flex items-center justify-center text-[#B99A5B]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#151515]">3. MUSEUM DISPLAY INTEGRITY</h3>
            <p className="text-xs text-[#858585] leading-relaxed">
              We engineer custom UV-filtering vitrines and marble pedestals so that your investment pieces are enjoyed as works of high industrial art.
            </p>
          </div>
        </div>
      </section>

      {/* Action */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
        >
          <span>EXPLORE OUR CURATED CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
