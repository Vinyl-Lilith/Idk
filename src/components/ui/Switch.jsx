import React from 'react';

export const Switch = ({ label, checked, onChange, disabled }) => (
  <label className={`flex items-center gap-3 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'}`}>
    <div className="relative flex-shrink-0">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-cyber-400/20 border-cyber-400/60' : 'bg-void-800 border-white/10'} border`}
        style={checked ? { boxShadow: '0 0 12px rgba(0,245,232,0.3)' } : {}}>
      </div>
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${checked ? 'translate-x-6 bg-cyber-400' : 'bg-slate-600'}`}
        style={checked ? { boxShadow: '0 0 8px rgba(0,245,232,0.8)' } : {}}>
      </div>
    </div>
    {label && <span className="text-sm font-body text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>}
  </label>
);
