import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../common/Button";
import ModalForm from "../common/ModalForm";
import CreateBillingDiscountForm from "../forms/CreateBillingDiscountForm";
import { toast } from "react-toastify";

const BillingDiscount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);

    const fetchDiscounts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/billing-discount");
            setDiscounts(response.data.data);
        } catch (err) {
            setError("Failed to fetch billing discounts.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleSave = (newDiscount) => {
        setDiscounts((prev) => [...prev, newDiscount]);
        toast.success("Discount created successfully!");
        setIsDiscountFormOpen(false);
        fetchDiscounts();
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

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white px-6 py-4 rounded-lg">
                {discounts.length === 0 ? (
                    <div className="text-sm text-gray-500 italic">No billing discounts available</div>
                ) : (
                    discounts.map((discount) => (
                        <div
                            key={discount.billingDiscountId}
                            className="grid grid-cols-12 gap-2 px-2 py-2 text-sm hover:bg-gray-50 border-b"
                        >
                            <div className="col-span-5 font-medium text-gray-800">
                                {discount.discountName}
                            </div>
                            <div className="col-span-3 text-gray-500 capitalize">
                                {discount.discountType === "percentage"
                                    ? `${discount.discountValue}%`
                                    : `₱${parseFloat(discount.discountValue).toFixed(2)}`}
                            </div>
                            <div className="col-span-3 text-gray-500">{discount.appliesTo}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white-100 text-center mt-2 rounded-b-lg">
                <div className="py-3">
                    <Button
                        onClick={() => setIsDiscountFormOpen(true)}
                        variant="grayTrans"
                        size="sm"
                        className="bg-white shadow rounded-lg p-5 flex items-center justify-center transition hover:shadow-md cursor-pointer border-dashed border-2 border-gray-300 hover:border-blue-500"
                    >
                        + Discount
                    </Button>
                </div>
            </div>

            {/* Modal for creating discount */}
            <ModalForm isOpen={isDiscountFormOpen} onClose={() => setIsDiscountFormOpen(false)}>
                <CreateBillingDiscountForm
                    onSave={handleSave}
                    onClose={() => setIsDiscountFormOpen(false)}
                />
            </ModalForm>
        </div>
    );
};

export default BillingDiscount;
