import { useState, useEffect } from 'react';
import { settingsAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Lock, Palette, Info, ShieldCheck, Mail, Calendar, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (user) { setNewUsername(user.username); setTheme(user.theme || 'light'); }
  }, [user]);

  const handleUpdateUsername = async () => {
    try { await settingsAPI.updateUsername(newUsername); toast.success('Username updated'); }
    catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const handleThemeChange = async (t) => {
    try { await settingsAPI.updateTheme(t); setTheme(t); toast.success(`Theme: ${t}`); }
    catch { toast.error('Failed to change theme'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 page-enter">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon size={14} className="text-cyber-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-400/60">System Config</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-white tracking-wider">
          OPER<span className="text-cyber-400">ATOR</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-6 border border-white/5 text-center">
            <div className="w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center text-3xl font-display font-bold text-cyber-400"
              style={{ background: 'rgba(0,245,232,0.08)', border: '1px solid rgba(0,245,232,0.15)', boxShadow: '0 0 20px rgba(0,245,232,0.08)' }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <p className="font-mono font-semibold text-white">{user?.username}</p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-xs font-mono"
              style={{ background: 'rgba(0,245,232,0.08)', color: '#00f5e8', border: '1px solid rgba(0,245,232,0.15)' }}>
              <ShieldCheck size={11} />
              {user?.role?.replace('_', ' ')}
            </div>

            <div className="mt-6 space-y-3 text-left border-t border-white/5 pt-5">
              {[
                { icon: Mail, label: user?.email },
                { icon: Calendar, label: user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : '' },
                { icon: ShieldCheck, label: `Status: ${user?.status || 'active'}`, color: user?.status === 'active' ? '#00f5e8' : '#fc8181' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 text-xs font-mono" style={{ color: color || '#475569' }}>
                  <Icon size={12} className="flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5 border border-cyber-400/10"
            style={{ background: 'rgba(0,245,232,0.03)' }}>
            <Info size={14} className="text-cyber-400/50 mb-2" />
            <p className="text-xs font-mono font-semibold text-cyber-400/70 mb-1">System Note</p>
            <p className="text-xs font-mono text-slate-700 leading-relaxed">
              Your username is logged with all sensor interactions and control actions visible to admins.
            </p>
          </div>
        </div>

        {/* Settings column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Identity */}
          <section className="glass rounded-xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
              <User size={14} className="text-cyber-400" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyber-400/70">Identity</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <Input label="Display Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="flex-1" />
              <Button onClick={handleUpdateUsername} size="md">Update</Button>
            </div>
          </section>

          {/* Password */}
          <section className="glass rounded-xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
              <Lock size={14} className="text-cyber-400" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyber-400/70">Security</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input type="password" label="Current Password" placeholder="required to make changes" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <Input type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" variant="secondary">Update Password</Button>
            </form>
          </section>

          {/* Theme */}
          <section className="glass rounded-xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
              <Palette size={14} className="text-cyber-400" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyber-400/70">Interface Theme</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', desc: 'Bright mode' },
                { id: 'dark', label: 'Dark', desc: 'Night mode' },
                { id: 'auto', label: 'Auto', desc: 'System pref' },
              ].map(({ id, label, desc }) => (
                <button key={id} onClick={() => handleThemeChange(id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    theme === id
                      ? 'border-cyber-400/40 bg-cyber-400/5'
                      : 'border-white/5 hover:border-white/10'
                  }`}>
                  <p className={`text-sm font-mono font-semibold ${theme === id ? 'text-cyber-400' : 'text-slate-400'}`}>{label}</p>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
