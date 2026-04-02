// import { X } from "lucide-react"; // optional (or use emoji)

function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
}) {
    return (
        <div className="relative w-full mb-6">

            {/* Search Icon */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
            </span>

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
                    w-full pl-10 pr-10 py-3
                    border border-gray-200
                    rounded-xl
                    text-sm
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500
                    transition
                "
            />

            {/* Clear Button */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    ✖
                </button>
            )}
        </div>
    );
}

export default SearchInput;