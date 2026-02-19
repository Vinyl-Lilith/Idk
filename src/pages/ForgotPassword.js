import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, MessageSquare, Lock, ArrowLeft, Hexagon } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [rememberedPassword, setRememberedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ username, message, rememberedPassword });
      toast.success('Request submitted. An admin will review it shortly.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f6e05e, transparent)', filter: 'blur(50px)' }} />

      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-3 mb-4">
            <Hexagon size={32} className="text-cyber-400" style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,232,0.4))' }} />
            <span className="font-display text-xl font-bold tracking-widest text-white">BIO<span className="text-cyber-400">CUBE</span></span>
          </Link>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">Password Recovery</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        </div>

        <div className="glass rounded-2xl p-8 border border-yellow-400/10 relative overflow-hidden">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">// Recovery Request</h2>
          <p className="text-xs font-mono text-slate-600 mb-6">Your request will be reviewed by an admin who will manually reset your password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Username / Email" icon={User} type="text" placeholder="your identifier" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-600 mb-1.5">Message to Admin</label>
              <textarea
                placeholder="Explain your situation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
                className="block w-full rounded-lg border border-white/5 bg-void-800/60 text-slate-200 placeholder-slate-600 font-body text-sm px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-yellow-400/40 focus:border-yellow-400/30 transition-all resize-none hover:border-yellow-400/15"
              />
            </div>

            <Input label="Password You Remember (optional)" icon={Lock} type="password" placeholder="may help verification" value={rememberedPassword} onChange={(e) => setRememberedPassword(e.target.value)} />

            <Button type="submit" className="w-full" isLoading={loading} size="lg"
              style={{ background: 'rgba(246,224,94,0.15)', color: '#f6e05e', border: '1px solid rgba(246,224,94,0.3)' }}>
              {loading ? 'Submitting...' : 'Submit Recovery Request'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5">
            <Link to="/login" className="flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-cyber-400 transition-colors">
              <ArrowLeft size={12} /> back_to_login()
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
