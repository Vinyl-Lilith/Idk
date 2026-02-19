import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  size = 'md',
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-body font-medium transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group";

  const variants = {
    primary:   "bg-cyber-400 text-void-900 hover:bg-cyber-300 shadow-cyber hover:shadow-cyber-strong active:scale-95",
    secondary: "glass text-cyber-400 border border-cyber-400/20 hover:border-cyber-400/50 hover:bg-cyber-400/5 active:scale-95",
    danger:    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-95",
    ghost:     "text-cyber-400/70 hover:text-cyber-400 hover:bg-cyber-400/5 active:scale-95",
    success:   "bg-bio-500/10 text-bio-400 border border-bio-500/20 hover:bg-bio-500/20 hover:border-bio-500/40 active:scale-95",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 pointer-events-none" />
      )}
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
