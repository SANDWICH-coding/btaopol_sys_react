import React from "react";

const SimpleTable = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.accessor}
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {data.map((row) => (
                                    <tr key={row.id}>
                                        {columns.map((col) => (
                                            <td
                                                key={col.accessor}
                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-700"
                                            >
                                                {row[col.accessor]}
                                            </td>
                                        ))}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-2">
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={columns.length + 1}
                                            className="text-center text-gray-500 py-4"
                                        >
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleTable;
