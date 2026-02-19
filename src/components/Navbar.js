import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { LayoutDashboard, Cpu, Sliders, ShieldAlert, Settings, LogOut, Menu, X, Hexagon } from 'lucide-react';

const navLinks = [
  { to: '/',        label: 'Dashboard', icon: LayoutDashboard },
  { to: '/logic',   label: 'Logic',     icon: Cpu },
  { to: '/manual',  label: 'Manual',    icon: Sliders },
  { to: '/settings',label: 'Settings',  icon: Settings },
];

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { connected } = useWebSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = isAdmin ? [...navLinks, { to: '/admin', label: 'Admin', icon: ShieldAlert }] : navLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-cyber-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Hexagon size={28} className="text-cyber-400 fill-cyber-400/10 group-hover:fill-cyber-400/20 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-cyber-400 text-xs font-mono font-bold">B</span>
                </div>
              </div>
              <span className="font-display text-lg font-bold tracking-wider text-white">
                BIO<span className="text-cyber-400">CUBE</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-cyber-400/10 text-cyber-400 shadow-cyber'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="font-mono text-xs tracking-wider uppercase">{label}</span>
                    {active && <span className="w-1 h-1 rounded-full bg-cyber-400 animate-pulse" />}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Connection status */}
              <div className="hidden sm:flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-cyber-400 animate-pulse' : 'bg-red-400'}`}
                  style={connected ? { boxShadow: '0 0 6px #00f5e8' } : {}} />
                <span className="text-xs font-mono text-slate-600">
                  {connected ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>

              {/* User */}
              <div className="hidden sm:flex items-center gap-3 glass px-3 py-1.5 rounded-lg border border-white/5">
                <div className="w-6 h-6 rounded bg-cyber-400/20 flex items-center justify-center">
                  <span className="text-cyber-400 text-xs font-mono font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{user?.username}</span>
                {isAdmin && (
                  <span className="text-xs font-mono text-cyber-400/60 border border-cyber-400/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {user?.role}
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/5"
              >
                <LogOut size={16} />
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-slate-400 hover:text-white p-2"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-cyber-400/10 px-4 pb-4 pt-2 space-y-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    active ? 'bg-cyber-400/10 text-cyber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/5 transition-all mt-2"
            >
              <LogOut size={16} />
              <span className="font-mono text-xs uppercase tracking-wider">Logout</span>
            </button>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
