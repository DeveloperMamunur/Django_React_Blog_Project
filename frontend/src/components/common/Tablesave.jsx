// components/common/Table.jsx
function formatHeader(key) {
  return key.charAt(0).toUpperCase() + key.slice(1); // e.g. "title" → "Title"
}

export default function Table({ columns, data, renderCell, emptyMessage = "No data found." }) {
  // Normalize columns: if it's a string, convert to { key, header }
    const normalizedColumns = columns.map((col) =>
        typeof col === "string" ? { key: col, header: formatHeader(col) } : col
    );

    return (
        <table className="w-full border border-gray-300 dark:border-gray-700">
        <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
            {normalizedColumns.map((col) => (
                <th key={col.key} className="p-2 border border-gray-300 dark:border-gray-600 text-left">
                {col.header}
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
            {data.length === 0 ? (
            <tr>
                <td colSpan={normalizedColumns.length} className="text-center p-3">
                {emptyMessage}
                </td>
            </tr>
            ) : (
            data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {normalizedColumns.map((col) => (
                    <td key={col.key} className="p-2 border border-gray-300 dark:border-gray-600">
                    {renderCell
                        ? renderCell(col, row[col.key], row)
                        : row[col.key]}
                    </td>
                ))}
                </tr>
            ))
            )}
        </tbody>
        </table>
    );
}
