import React, { useState } from 'react';
import { Settings, Shield, Building2, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('ZHONGKUI');
  const [slogan, setSlogan] = useState('COLLECT. PRESERVE. DISPLAY.');
  const [currency, setCurrency] = useState('USD');
  const [abaAccount, setAbaAccount] = useState('001 849 203');
  const [merchantName, setMerchantName] = useState('ZHONGKUI COLLECTIBLES CO., LTD');
  const [shippingThreshold, setShippingThreshold] = useState('300');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-[#151515]/10 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            CONFIGURATION
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
            STORE SETTINGS
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Store Brand Settings */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#B99A5B]" />
            <span>BRAND & DISPLAY IDENTITY</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#858585] mb-1">Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Brand Slogan</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
          </div>
        </div>

        {/* Cambodia Payment & Settlement */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#B99A5B]" />
            <span>CAMBODIA BANKING & SETTLEMENT</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#858585] mb-1">ABA Bank Account Number</label>
              <input
                type="text"
                value={abaAccount}
                onChange={(e) => setAbaAccount(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 font-mono text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">KHQR Registered Merchant Name</label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Operating Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 font-mono text-[#151515]"
              >
                <option value="USD">USD ($)</option>
                <option value="KHR">KHR (៛)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Free Insured Courier Threshold ($)</label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 font-mono text-[#151515]"
              />
            </div>
          </div>
        </div>

        {/* Administrator Profile Security */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#B99A5B]" />
            <span>ADMINISTRATOR IDENTITY</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#858585] mb-1">Curator Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Master Email</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#151515]/10">
          <button
            type="submit"
            className="px-6 py-3 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-[#B99A5B]" />
                <span>SETTINGS SAVED</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE CONFIGURATION</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
