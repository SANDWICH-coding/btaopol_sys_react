import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../common/Button";
import CreateBillItemForm from "../forms/CreateBillItemForm";
import ModalForm from "../common/ModalForm";
import UpdateBillItemForm from "../forms/UpdateBillItemForm";
import { MdFormatListBulletedAdd } from "react-icons/md";

const ITEMS_PER_PAGE = 1;

const BillingConfiguration = () => {
    const [groupedData, setGroupedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal control states
    const [isBillItemFormOpen, setIsBillItemFormOpen] = useState(false);
    const [selectedYearLevelId, setSelectedYearLevelId] = useState(null);
    const [selectedYearLevelName, setSelectedYearLevelName] = useState("");

    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedBillingItem, setSelectedBillingItem] = useState(null);

    // Fetch billing configurations and year levels
    const fetchData = async () => {
        try {
            const [billingResponse, yearLevelResponse] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/billing-configuration"),
                axios.get("http://127.0.0.1:8000/api/year-level")
            ]);

            const billings = billingResponse.data;
            const yearLevels = yearLevelResponse.data;

            const grouped = yearLevels.map(level => {
                const levelBillings = billings.filter(
                    bill => bill.year_levels.yearLevelId === level.yearLevelId
                );

                return {
                    yearLevelId: level.yearLevelId,
                    yearLevelName: level.yearLevelName,
                    billings: levelBillings
                };
            });

            setGroupedData(grouped);
        } catch (err) {
            setError("Failed to fetch data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Initial data fetch
    }, []);

    // Handle edit action (open update form)
    const handleEdit = (billing) => {
        setSelectedBillingItem(billing);
        setIsUpdateFormOpen(true);
    };

    // Handle update (update state directly without re-fetching)
    const handleUpdate = (updatedItem) => {
        // Update state with the updated billing item
        setGroupedData(prev =>
            prev.map(group => ({
                ...group,
                billings: group.billings.map(bill =>
                    bill.billingConfigId === updatedItem.billingConfigId ? updatedItem : bill
                )
            }))
        );
        setIsUpdateFormOpen(false);
        fetchData();  // Re-fetch data after the update
    };

    // Handle save (add new item to the state)
    const handleSave = (newItem) => {
        setGroupedData(prev => {
            return prev.map(group => {
                if (group.yearLevelId === newItem.yearLevelId) {
                    return {
                        ...group,
                        billings: [...group.billings, newItem] // Add the new item to the specific year level
                    };
                }
                return group;
            });
        });
        setIsBillItemFormOpen(false);  // Close the modal

        // Re-fetch data to ensure the new item is included in the grouped data
        fetchData();
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                {[...Array(1)].map((_, index) => (
                    <div key={index} className="bg-white border rounded animate-pulse">
                        <div className="flex justify-between items-center p-4 bg-gray-100">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) return <div className="text-red-500">{error}</div>;

    const yearLevels = Object.values(groupedData);
    const totalPages = Math.ceil(yearLevels.length / ITEMS_PER_PAGE);
    const paginatedGroups = groupedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-5xl mx-auto">
            {groupedData.some(group => group.billings.length > 0) && (
                <div>{/* Optionally add table headers here */}</div>
            )}

            {paginatedGroups.map(group => (
                <div key={group.yearLevelId} className="bg-white px-6">
                    <div className="flex items-center justify-between border-t border-b bg-gray-100">
                        <h4 className="font-medium text-sm px-2 text-gray-800">{group.yearLevelName}</h4>
                        <Button
                            onClick={() => {
                                setSelectedYearLevelId(group.yearLevelId);
                                setSelectedYearLevelName(group.yearLevelName);
                                setIsBillItemFormOpen(true);
                            }}
                            variant="ghost"
                            size="md"
                            className="text-xl"
                        >
                            <MdFormatListBulletedAdd />
                        </Button>
                    </div>

                    {group.billings.length === 0 ? (
                        <div className="text-sm px-6 py-2 text-gray-500 italic">No billing available</div>
                    ) : (
                        group.billings.map(bill => (
                            <div
                                key={bill.billingConfigId}
                                className="grid grid-cols-12 gap-2 px-2 py-2 text-sm hover:bg-gray-50"
                            >
                                <div className="col-span-5 px-2 text-gray-800">{bill.billing_items.billItem}</div>
                                <div className="col-span-3 px-2 text-gray-500 flex items-left">
                                    ₱ {parseFloat(bill.amount).toFixed(2)}
                                </div>
                                <div className="col-span-4 px-2 space-x-2 flex justify-end items-center">
                                    <button
                                        onClick={() => handleEdit(bill)}
                                        className="text-indigo-800 hover:underline"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 my-6">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1.5 text-xs border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 text-sm py-1">{currentPage} / {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1.5 text-xs border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Modal Form for Creating a Billing Item */}
            <ModalForm isOpen={isBillItemFormOpen} onClose={() => setIsBillItemFormOpen(false)}>
                <CreateBillItemForm
                    yearLevelId={selectedYearLevelId}
                    yearLevelName={selectedYearLevelName}
                    onSave={handleSave}
                    onClose={() => setIsBillItemFormOpen(false)}
                />
            </ModalForm>

            {/* Modal Form for Updating a Billing Item */}
            <ModalForm isOpen={isUpdateFormOpen} onClose={() => setIsUpdateFormOpen(false)}>
                {selectedBillingItem && (
                    <UpdateBillItemForm
                        billing={selectedBillingItem}
                        onClose={() => setIsUpdateFormOpen(false)}
                        onUpdate={handleUpdate}  // Pass fetchData to re-fetch after update
                    />
                )}
            </ModalForm>
        </div>
    );
};

export default BillingConfiguration;
