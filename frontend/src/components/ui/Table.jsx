import "./Table.css";
export default function Table({
    columns,
    data,
    renderCell,
    renderActions,
}) {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>
                            {col.label}
                        </th>
                    ))}
                    {renderActions && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (

                    <tr key={row.id}>

                        {columns.map((col) => (

                            <td key={col.key}>

                                {renderCell
                                    ? renderCell(row, col)
                                    : row[col.key]}

                            </td>

                        ))}
                        {renderActions && (
                            <td>
                                {renderActions(row)}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}