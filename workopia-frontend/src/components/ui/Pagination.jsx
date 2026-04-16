import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ pagination, onPageChange }) {
  const { current_page, last_page } = pagination;

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= last_page; i++) {
      if (i === 1 || i === last_page || (i >= current_page - 1 && i <= current_page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Showing page <span className="font-bold text-gray-900">{current_page}</span> of <span className="font-bold text-gray-900">{last_page}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-2xl shadow-sm border border-slate-100 overflow-hidden" aria-label="Pagination">
            <button
              onClick={() => onPageChange(current_page - 1)}
              disabled={current_page === 1}
              className="relative inline-flex items-center px-3 py-2 text-gray-400 hover:bg-slate-50 disabled:opacity-20 transition-colors"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            
            {getPages().map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  page === current_page
                    ? 'z-10 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'text-gray-500 hover:bg-slate-50 hover:text-indigo-600'
                } ${page === '...' ? 'cursor-default' : ''}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(current_page + 1)}
              disabled={current_page === last_page}
              className="relative inline-flex items-center px-3 py-2 text-gray-400 hover:bg-slate-50 disabled:opacity-20 transition-colors"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
