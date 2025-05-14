import { useState } from "react";
import axios from "axios";
import Button from "../common/Button";
import Input from "../common/Input";
import { toast } from "react-toastify";

const UpdateBillItemForm = ({ billing, onClose, onUpdate }) => {
    const [amount, setAmount] = useState(billing.amount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/billing-configuration/${billing.billingConfigId}`,
                { amount }
            );
            toast.info("Billing item updated.");
            onUpdate(response.data);  // Pass the updated item directly
            onClose();  // Close the modal
        } catch (err) {
            setError("Failed to update billing item");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-gray-600 mb-6">Update Item</h3>
            <div>
                <Input
                    label="Billing Item"
                    type="text"
                    value={billing.billing_items.billItem}
                    disabled
                />
            </div>

            <div>
                <Input
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onClose} variant="gray">Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Saving..." : "Update"}
                </Button>
            </div>
        </form>
    );
};

export default UpdateBillItemForm;
