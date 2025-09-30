export default function Table({ columns, data, renderCell, emptyMessage = "No data found." }) {
    
    return (
        <table className="w-full border border-gray-300 dark:border-gray-700">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                {columns.map((col) => (
                    <th
                        key={col.key}
                        className="p-2 border border-gray-300 dark:border-gray-600 text-left"
                    >
                        { col.header }
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="text-center p-3">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr
                            key={row.id || rowIndex}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {columns.map((col) => {
                                let value = row[col.key];

                                // Apply truncate if configured
                                if (col.truncate && typeof value === "string") {
                                    value =
                                        value.length > col.truncate
                                        ? value.slice(0, col.truncate) + "..."
                                        : value;
                                }

                                return (
                                    <td
                                        key={col.key}
                                        className="p-2 border border-gray-300 dark:border-gray-600"
                                    >
                                        {renderCell ? renderCell(col, value, row) : value} 
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
