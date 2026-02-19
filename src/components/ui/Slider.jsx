import React from 'react';

export const Slider = ({ label, min, max, value, onChange, unit = "" }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</label>
        <span className="text-sm font-mono text-cyber-400 tabular-nums">{value}{unit}</span>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 rounded-l-full bg-cyber-400/30 transition-all duration-100 pointer-events-none h-1 top-1/2 -translate-y-1/2"
          style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="relative w-full"
          style={{ zIndex: 1 }}
        />
      </div>
      <div className="flex justify-between text-xs font-mono text-slate-700">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
