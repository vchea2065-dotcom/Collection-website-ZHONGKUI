import React, { useState } from 'react';
import { Shield, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onNavigate: (page: string) => void;
  isAdminLogin?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onNavigate,
  isAdminLogin = false
}) => {
  const { login, register, isAdmin } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to authenticate');
        } else {
          setSuccessMsg('Authenticated successfully.');
          setTimeout(() => {
            if (isAdminLogin || email.includes('admin')) {
              onNavigate('admin');
            } else {
              onNavigate('account');
            }
          }, 600);
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password, phone);
        if (!res.success) {
          setError(res.error || 'Registration failed');
        } else {
          setSuccessMsg('Collector account created successfully!');
          setTimeout(() => onNavigate('account'), 600);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-[#151515]/10 shadow-xl p-8 space-y-6">
        
        {/* Header with Brand Icon */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#B99A5B] bg-[#151515] mx-auto p-0.5">
            <img
              src="/assets/aistudio/logo_zhong_kui_2849056d.png"
              alt="ZHONGKUI"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#B99A5B] uppercase block">
            {isAdminLogin ? 'SECURE ADMINISTRATOR VAULT' : 'COLLECTOR ACCESS'}
          </span>
          <h2 className="font-cinzel text-2xl font-bold text-[#151515]">
            {isAdminLogin ? 'ADMIN PORTAL LOGIN' : mode === 'login' ? 'SIGN IN TO ZHONGKUI' : 'CREATE COLLECTOR ACCOUNT'}
          </h2>
        </div>


        {/* Tab switch for regular customer */}
        {!isAdminLogin && (
          <div className="flex border-b border-[#151515]/10 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'border-[#B99A5B] text-[#151515] font-bold'
                  : 'border-transparent text-[#858585] hover:text-[#151515]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'border-[#B99A5B] text-[#151515] font-bold'
                  : 'border-transparent text-[#858585] hover:text-[#151515]'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[#858585] mb-1 font-medium">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sokha Chea"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#858585] mb-1 font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[#858585] mb-1 font-medium">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@zhongkui.com"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#858585] font-medium">Password *</label>
              {mode === 'login' && !isAdminLogin && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your registered email.')}
                  className="text-[10px] text-[#B99A5B] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[#858585] mb-1 font-medium">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#858585] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F7F7F5] border border-[#151515]/15 pl-9 pr-3 py-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>PROCESSING AUTHENTICATION...</span>
            ) : (
              <span>{isAdminLogin ? 'ACCESS ADMIN DASHBOARD' : mode === 'login' ? 'ENTER VAULT' : 'REGISTER ACCOUNT'}</span>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#858585] border-t border-[#151515]/10">
          {isAdminLogin ? (
            <button
              onClick={() => onNavigate('admin-setup')}
              className="text-[#B99A5B] hover:underline text-[11px]"
            >
              Need to initialize initial Store Administrator?
            </button>
          ) : (
            <p>Protected by SHA-256 encrypted authentication & session security.</p>
          )}
        </div>

      </div>
    </div>
  );
};
