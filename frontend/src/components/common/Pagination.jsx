export default function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.last_page <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-gray-50 bg-white">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(pagination.last_page, 5) }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-500 ${
                                pagination.current_page === i + 1 ? 'w-8 bg-primary' : 'w-2 bg-gray-100'
                            }`}
                        />
                    ))}
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">
                    Page <span className="text-gray-900">{pagination.current_page}</span> / {pagination.last_page}
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={pagination.current_page === 1}
                        onClick={() => onPageChange(pagination.current_page - 1)}
                        className="px-6 py-3 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 disabled:opacity-20 hover:bg-gray-50 hover:text-primary transition-all active:scale-95"
                    >
                        Prev
                    </button>
                    <button
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => onPageChange(pagination.current_page + 1)}
                        className="px-6 py-3 bg-gray-900 border border-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-20 hover:bg-primary hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all active:scale-95"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

