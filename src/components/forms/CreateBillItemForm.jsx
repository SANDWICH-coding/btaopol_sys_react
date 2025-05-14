import React, { useState } from "react";
import axios from "axios";
import Input from "../common/Input";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import { toast } from "react-toastify";

const CreateBillItemForm = ({ yearLevelId, yearLevelName, onClose, onSave, setGroupedData, setIsBillItemFormOpen }) => {
    const [formData, setFormData] = useState({
        billItem: "",
        category: "",
        amount: "",
        isRequired: true,
        remarks: "",
    });

    const [errors, setErrors] = useState({});
    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setCustomError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setCustomError("");

        const { billItem, category, amount, remarks } = formData;

        if (!billItem || !category || !amount) {
            setCustomError("Please fill out all required fields.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                yearLevelId,
                amount: parseFloat(amount),
                billingItem: {
                    billItem,
                    category,
                    remarks,
                },
            };

            const response = await axios.post(
                "http://localhost:8000/api/billing-configuration",
                payload
            );

            toast.success("Billing item created!");
            onSave && onSave(response.data);  // Pass new item directly to the parent
            onClose && onClose(); // Close modal
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setCustomError("Failed to create billing item.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="font-semibold text-gray-600 mb-6">
                Create New Item: <span className="text-blue-700">{yearLevelName}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Item Name"
                        name="billItem"
                        value={formData.billItem}
                        onChange={handleChange}
                        error={errors["billingItem.billItem"]?.[0]}
                    />
                    <Dropdown
                        label="Category"
                        items={[
                            { label: 'Registration', value: 'Registration' },
                            { label: 'Tuition', value: 'Tuition' },
                            { label: 'Miscellaneous', value: 'Miscellaneous' },
                            { label: 'Books', value: 'Books' },
                            { label: 'Others', value: 'Others' }
                        ]}
                        selectedItem={formData.category ? { label: formData.category, value: formData.category } : null}
                        onSelect={(item) => setFormData(prev => ({ ...prev, category: item.value }))}
                        error={errors["billingItem.category"]?.[0]}
                    />
                    <Input
                        label="Amount (₱)"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        error={errors.amount?.[0]}
                    />
                    <Input
                        label="Remarks (optional)"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        error={errors["billingItem.remarks"]?.[0]}
                    />
                </div>

                {customError && (
                    <p className="text-sm text-red-600 text-right">{customError}</p>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateBillItemForm;
