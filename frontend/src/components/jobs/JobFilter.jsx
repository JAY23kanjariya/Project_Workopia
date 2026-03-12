const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="12" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default function JobFilter({ search, setSearch, categoryId, setCategoryId, categories }) {
    return (
        <div className="bg-white p-2 md:p-3 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-100 mb-16 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400">
                    <IconSearch />
                </div>
                <input
                    type="text"
                    placeholder="Search by role or proficiency..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-14 pr-4 py-5 bg-transparent border-none rounded-2xl focus:ring-0 transition-all font-black text-gray-900 placeholder-gray-400"
                />
            </div>
            <div className="h-10 w-px bg-gray-100 hidden md:block self-center"></div>
            <div className="relative">
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full md:w-64 pl-6 pr-12 py-5 bg-transparent border-none rounded-2xl focus:ring-0 transition-all font-black text-gray-500 appearance-none cursor-pointer"
                >
                    <option value="">All Scopes</option>
                    {Array.isArray(categories) && categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
            <button className="hidden md:flex items-center justify-center px-10 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20">
                Hunt
            </button>
        </div>
    );
}

