import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSetupProps {
  onNavigate: (page: string) => void;
}

export const AdminSetup: React.FC<AdminSetupProps> = ({ onNavigate }) => {
  const { setupAdmin, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Administrator password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await setupAdmin(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to initialize store administrator');
      } else {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('admin');
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Error configuring administrator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white border border-[#151515]/10 shadow-2xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#151515] text-[#B99A5B] flex items-center justify-center mx-auto border-2 border-[#B99A5B]">
            <KeyRound className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#B99A5B] uppercase block font-semibold">
            STORE MASTER INITIALIZATION
          </span>
          <h2 className="font-cinzel text-2xl font-bold text-[#151515]">
            CREATE STORE ADMINISTRATOR
          </h2>
          <p className="text-xs text-[#858585] max-w-sm mx-auto leading-relaxed">
            In compliance with security standards, no public default credentials exist. Please establish the root administrator account for ZHONGKUI.
          </p>
        </div>

        {isConfigured && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>An administrator account already exists. You can sign in using your existing credentials.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Administrator account initialized! Launching Admin Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#858585] mb-1 font-medium">Administrator Name *</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Curator Director"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#858585] mb-1 font-medium">Administrator Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zhongkui.com"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#858585] mb-1 font-medium">Master Password (Min 8 Characters) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#858585] mb-1 font-medium">Confirm Master Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || isConfigured}
              className="w-full py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'INITIALIZING...' : 'INITIALIZE STORE ADMINISTRATOR'}</span>
            </button>
          </div>
        </form>

        <div className="pt-2 text-center text-xs text-[#858585] border-t border-[#151515]/10">
          <button
            onClick={() => onNavigate('admin-login')}
            className="text-[#151515] hover:text-[#B99A5B] font-semibold"
          >
            Already initialized? Sign In to Admin &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
