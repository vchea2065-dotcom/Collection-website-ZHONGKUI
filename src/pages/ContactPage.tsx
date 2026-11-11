import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Private Sourcing Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="border-b border-[#151515]/10 pb-6 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block">
          CONCIERGE & ADVISORY
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-[#151515]">
          CONTACT ZHONGKUI
        </h1>
        <p className="text-xs text-[#858585] leading-relaxed">
          Whether inquiring about a specific PSA card slab, placing a bespoke diecast acquisition request, or arranging private vault viewing in Phnom Penh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Direct Inquiries Form */}
        <div className="lg:col-span-7 bg-white border border-[#151515]/10 p-8 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#151515]">INQUIRY RECEIVED</h3>
              <p className="text-xs text-[#858585] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. A ZHONGKUI senior curator has been assigned to your request and will reach out via <strong>{email}</strong> within 12 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-[#151515] text-white text-xs font-semibold uppercase hover:bg-[#B99A5B] transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#151515] border-b border-[#151515]/10 pb-2">
                COLLECTOR INQUIRY FORM
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#858585] mb-1 font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vichea Sok"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#858585] mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@example.com"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#858585] mb-1 font-medium">Inquiry Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                >
                  <option value="Private Sourcing Request">Private Sourcing (Rare Pokémon / Diecast)</option>
                  <option value="Authentication & Condition Inquiry">Card Authentication / Certification Details</option>
                  <option value="Local Cambodia Viewing">Private Showroom Appointment (Phnom Penh)</option>
                  <option value="Corporate / High-Value Wire Settlement">High-Value Settlement / ABA Transfer Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[#858585] mb-1 font-medium">Message / Specific Pieces Sought *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the card, scale model, or request you would like our team to assist with..."
                  className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-3 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SUBMIT INQUIRY TO CURATOR</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Office, Gallery & Banking Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#151515] text-[#F7F7F5] p-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99A5B] block">
              VAULT LOCATION & CONCIERGE
            </span>
            <h3 className="font-cinzel text-lg font-bold text-white">
              ZHONGKUI PHNOM PENH VAULT
            </h3>

            <div className="space-y-4 text-xs text-[#858585]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Private Showroom & Vault</span>
                  <span>Preah Norodom Boulevard, Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh, Kingdom of Cambodia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Telephone Concierge</span>
                  <span className="font-mono">+855 (0) 23 888 203 (Direct Hotline)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Curatorial Dispatch</span>
                  <span className="font-mono">concierge@zhongkui.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Hours of Operation</span>
                  <span>Monday – Saturday: 10:00 AM – 7:00 PM (By Private Appointment)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#B99A5B]">
              <ShieldCheck className="w-4 h-4" />
              <span>Armored security vault facility with 24/7 biometric access.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
