import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, Hexagon, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const success = await register(username, email, password);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00f5e8, transparent)', filter: 'blur(60px)' }} />

      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-3 mb-4">
            <Hexagon size={32} className="text-cyber-400" style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,232,0.4))' }} />
            <span className="font-display text-xl font-bold tracking-widest text-white">BIO<span className="text-cyber-400">CUBE</span></span>
          </Link>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">Create Operator Account</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyber-400/30 to-transparent" />
        </div>

        <div className="glass rounded-2xl p-8 border border-cyber-400/10 cyber-border relative overflow-hidden">
          <div className="scan-line opacity-10" />
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">{"// New Registration"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Username" icon={User} type="text" placeholder="operator_id" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
            <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" icon={Lock} type="password" placeholder="min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="Confirm Password" icon={Lock} type="password" placeholder="repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <div className="pt-2">
              <Button type="submit" className="w-full" isLoading={loading} size="lg">
                {loading ? 'Creating...' : 'Register Operator'}
                {!loading && <ChevronRight size={16} />}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs font-mono text-slate-700">
              Have an account?{' '}
              <Link to="/login" className="text-cyber-400 hover:text-cyber-300 transition-colors">login()</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
