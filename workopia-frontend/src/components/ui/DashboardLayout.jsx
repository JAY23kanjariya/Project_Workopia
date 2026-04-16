"use client";

import React from 'react';
import Link from 'next/link';
import StatsCard from './StatsCard';
import { FiArrowRight, FiActivity, FiArrowUpRight, FiClock } from 'react-icons/fi';

export default function DashboardLayout({ stats, cards, actions }) {
  // Mock data for the chart bars
  const chartBars = [45, 75, 55, 95, 65, 85, 40, 90, 100, 80, 55, 70];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           {actions.map((action, i) => (
             <Link 
               key={i} 
               href={action.link} 
               className="group px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all flex items-center gap-2"
             >
               {action.label}
               <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
             </Link>
           ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <StatsCard 
            key={i}
            title={card.title}
            value={stats ? stats[card.key] : '...'}
            color={card.color}
          />
        ))}
      </div>

      {/* Main Content Area: Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Chart (Elegant SVG-based Chart) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="flex items-center justify-between mb-12">
             <div>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">User Engagement</h3>
                <p className="text-sm text-gray-400 font-medium">Activity trends over the last 12 periods</p>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               Live Stats
             </div>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-3 px-2 relative z-10">
             {chartBars.map((h, i) => (
               <div key={i} className="group/bar relative flex flex-1 flex-col items-center h-full justify-end">
                 <div 
                   style={{ height: `${h}%` }}
                   className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 ease-out cursor-pointer relative ${
                     i === chartBars.length - 1 
                     ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20' 
                     : 'bg-slate-100 group-hover/bar:bg-blue-100'
                   }`}
                 >
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl opacity-0 scale-90 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all z-20 whitespace-nowrap whitespace-pre">
                      {h} Active Users
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                   </div>
                 </div>
               </div>
             ))}
             
             {/* Background Grid Lines */}
             <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-20 py-2">
                {[1, 2, 3, 4].map(l => (
                  <div key={l} className="w-full border-t border-dashed border-slate-300"></div>
                ))}
             </div>
           </div>

           {/* Labels */}
           <div className="mt-8 flex justify-between text-[11px] text-gray-400 font-bold px-4 uppercase tracking-widest">
             <span>Jan</span>
             <span>Apr</span>
             <span>Jul</span>
             <span>Oct</span>
             <span>Dec</span>
           </div>
        </div>

        {/* Recent Activity Section */}
        {/* <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900 text-lg tracking-tight">Recent Activity</h3>
              <FiClock className="text-gray-300 w-5 h-5" />
           </div>

           <div className="space-y-7 flex-1">
             {[
               { id: 1, user: 'Sarah Wilson', action: 'New Candidate Registered', time: '2m ago', color: 'bg-blue-100 text-blue-600' },
               { id: 2, user: 'Tech Corp', action: 'Posted 3 New Job Openings', time: '14m ago', color: 'bg-emerald-100 text-emerald-600' },
               { id: 3, user: 'System', action: 'Database Backup Completed', time: '1h ago', color: 'bg-slate-100 text-slate-600' },
               { id: 4, user: 'HR Team', action: 'Approved 4 Applications', time: '3h ago', color: 'bg-indigo-100 text-indigo-600' },
               { id: 5, user: 'Mike Ross', action: 'Updated Site Settings', time: '5h ago', color: 'bg-amber-100 text-amber-600' },
             ].map((item) => (
               <div key={item.id} className="flex items-start gap-4 group">
                 <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110 ${item.color}`}>
                   {item.user[0]}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-extrabold text-gray-900 leading-tight truncate">{item.user}</p>
                   <p className="text-[11px] text-gray-400 font-medium mt-0.5">{item.action}</p>
                 </div>
                 <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap mt-1">{item.time}</span>
               </div>
             ))}
           </div>

           <button className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-500 transition-all active:scale-[0.98]">
             View Detailed Logs
           </button>
        </div> */}
      </div>
    </div>
  );
}
