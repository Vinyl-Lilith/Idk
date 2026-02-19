import React from 'react';

export const Input = ({
  label,
  icon: Icon,
  error,
  className = '',
  hint,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-mono font-medium text-cyber-400/70 mb-1.5 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-400/40 group-focus-within:text-cyber-400 transition-colors">
            <Icon size={16} />
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border bg-void-800/60
            text-slate-200 placeholder-slate-600 font-body text-sm
            focus:outline-none focus:ring-1 focus:ring-cyber-400/50 focus:border-cyber-400/40
            transition-all duration-200 py-2.5 pr-3
            ${Icon ? 'pl-9' : 'pl-3'}
            ${error
              ? 'border-red-500/40 focus:ring-red-400/50 focus:border-red-400/40'
              : 'border-white/5 hover:border-cyber-400/20'
            }
          `}
          {...props}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-400/0 to-transparent group-focus-within:via-cyber-400/50 transition-all duration-300" />
      </div>
      {error && <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>}
      {hint && <p className="mt-1 text-xs text-slate-600 font-mono">{hint}</p>}
    </div>
  );
};
