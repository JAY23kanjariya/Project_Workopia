import React from 'react';
import { FiTrendingUp, FiLayers, FiUsers, FiBriefcase, FiFileText } from 'react-icons/fi';

const iconMap = {
    blue: <FiLayers className="w-6 h-6 text-blue-600" />,
    green: <FiUsers className="w-6 h-6 text-emerald-600" />,
    red: <FiBriefcase className="w-6 h-6 text-red-600" />,
    yellow: <FiFileText className="w-6 h-6 text-amber-600" />,
};

const bgMap = {
    blue: 'bg-blue-50',
    green: 'bg-emerald-50',
    red: 'bg-red-50',
    yellow: 'bg-amber-50',
};

export default function StatsCard({ title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-none">{value || 0}</h3>
                <div className="flex items-center gap-1 mt-2 text-emerald-500">
                    <FiTrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold">+12.5% vs last month</span>
                </div>
            </div>
            <div className={`p-4 rounded-2xl ${bgMap[color]} group-hover:scale-110 transition-transform duration-300`}>
                {iconMap[color]}
            </div>
        </div>
    );
}
