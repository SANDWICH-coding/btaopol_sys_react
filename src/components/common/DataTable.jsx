import { useState, useMemo } from "react";
import Input from "./Input";
import Button from "./Button";
import { ArrowUpDown } from "lucide-react";

const DataTable = ({ columns, data }) => {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let filtered = data.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );

        if (sortKey) {
            filtered = filtered.sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];
                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [data, search, sortKey, sortOrder]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (
        <div className="px-6 pb-4 bg-white rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <Input
                    placeholder="Search..."
                    className="max-w-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 cursor-pointer"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {paginatedData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-4">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between border-t pt-4 items-center mt-4">
                <p className="text-xs text-gray-500">
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredData.length)} to
                    {" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Prev
                    </Button>
                    <span className="text-xs">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;