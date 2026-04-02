function Badge({ label, variant = "default", size = "sm" }) {

    const variants = {
        default: "bg-gray-100 text-gray-700",
        success: "bg-green-100 text-green-700",
        danger: "bg-red-100 text-red-700",
        warning: "bg-yellow-100 text-yellow-700",
        info: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
    };

    const sizes = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1",
    };

    return (
        <span
            className={`
                inline-block font-semibold rounded-full
                ${variants[variant] || variants.default}
                ${sizes[size]}
            `}
        >
            {label}
        </span>
    );
}

export default Badge;