import React from 'react';

export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/5">
          {headers.map((h) => (
            <th key={h} className="text-left px-6 py-4 text-xs font-mono uppercase tracking-widest text-slate-600">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {children}
      </tbody>
    </table>
  </div>
);
