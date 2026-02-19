import React from 'react';

const colorMap = {
  'bg-orange-500': { accent: '#fb923c', glow: 'rgba(251,146,60,0.15)', text: 'text-orange-400', border: 'border-orange-500/20' },
  'bg-blue-500':   { accent: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  text: 'text-blue-400',   border: 'border-blue-500/20'   },
  'bg-yellow-500': { accent: '#facc15', glow: 'rgba(250,204,21,0.15)',  text: 'text-yellow-400', border: 'border-yellow-500/20' },
  'bg-emerald-500':{ accent: '#34d399', glow: 'rgba(52,211,153,0.15)',  text: 'text-emerald-400',border: 'border-emerald-500/20'},
  'bg-purple-500': { accent: '#a78bfa', glow: 'rgba(167,139,250,0.15)', text: 'text-purple-400', border: 'border-purple-500/20' },
  'bg-cyan-500':   { accent: '#00f5e8', glow: 'rgba(0,245,232,0.15)',   text: 'text-cyan-400',   border: 'border-cyan-500/20'   },
};

export const SensorCard = ({ label, value, unit, icon: Icon, colorClass, sublabel }) => {
  const colors = colorMap[colorClass] || colorMap['bg-cyan-500'];
  const hasValue = value !== null && value !== undefined && value !== '--';

  return (
    <div
      className={`relative glass glass-hover rounded-xl p-5 overflow-hidden group cursor-default ${colors.border} border transition-all duration-300`}
      style={{ boxShadow: `0 4px 24px ${colors.glow}` }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5 rounded-bl-full" style={{ background: colors.accent }} />

      {/* Scan line on hover */}
      <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${colors.text} bg-current/10`}
          style={{ background: colors.glow }}>
          <Icon size={18} style={{ color: colors.accent }} />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.accent, boxShadow: `0 0 6px ${colors.accent}` }} />
          <span className="text-xs font-mono text-slate-600">LIVE</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-mono font-bold tracking-tight" style={{ color: hasValue ? colors.accent : '#334155' }}>
            {hasValue ? value : '--'}
          </span>
          <span className="text-sm font-mono" style={{ color: colors.accent + '80' }}>{unit}</span>
        </div>
        {sublabel && <p className="text-xs text-slate-600 mt-1 font-mono">{sublabel}</p>}
      </div>
    </div>
  );
};
