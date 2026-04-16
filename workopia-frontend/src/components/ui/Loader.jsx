import React from 'react';

export default function Loader({ text = "Loading data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-400 tracking-wide uppercase italic">{text}</p>
    </div>
  );
}
