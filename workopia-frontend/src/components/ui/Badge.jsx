import React from 'react';

/**
 * Badge Component
 * 
 * Supports variants: 'info', 'success', 'danger', 'purple', 'disabled'
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200";
  
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    disabled: "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-70",
  };

  // Map 'text' or 'purple' to the purple variant if specified as such
  const activeVariant = variant === 'text' || variant === 'purple' ? 'purple' : variant;
  const variantStyles = variants[activeVariant] || variants.default;

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;