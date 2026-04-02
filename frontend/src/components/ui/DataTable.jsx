function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyText = "No data found",
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">

                    {/* Header */}
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-3 text-gray-600 font-semibold ${
                                        col.align === "right" ? "text-right" : "text-left"
                                    }`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row.id || rowIndex} className="border-t hover:bg-gray-50 transition">
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-4 py-3 ${
                                                col.align === "right" ? "text-right" : ""
                                            }`}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default DataTable;