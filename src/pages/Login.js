import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Lock, Hexagon, ChevronRight } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00f5e8, transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #48bb78, transparent)', filter: 'blur(40px)' }} />

      {/* Animated corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-cyber-400/20 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-cyber-400/20 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-cyber-400/20 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-cyber-400/20 rounded-br-lg" />

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <Hexagon size={40} className="text-cyber-400" style={{ filter: 'drop-shadow(0 0 12px rgba(0,245,232,0.5))' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyber-400 text-sm font-mono font-bold">B</span>
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-widest text-white">
              BIO<span className="text-cyber-400">CUBE</span>
            </h1>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-600">Greenhouse Intelligence System</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyber-400/30 to-transparent" />
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-cyber-400/10 cyber-border relative overflow-hidden">
          <div className="scan-line opacity-20" />
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">
            {"// Authentication Required"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Identifier"
              icon={User}
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Access Key"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-mono text-slate-600 hover:text-cyber-400 transition-colors">
                forgot_password()
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={loading} size="lg">
              {loading ? 'Authenticating...' : 'Access System'}
              {!loading && <ChevronRight size={16} />}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs font-mono text-slate-700">
              No account?{' '}
              <Link to="/signup" className="text-cyber-400 hover:text-cyber-300 transition-colors">
                register()
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-mono text-slate-800 mt-6">
          BioCube v1.0 • Encrypted Connection
        </p>
      </div>
    </div>
  );
};
