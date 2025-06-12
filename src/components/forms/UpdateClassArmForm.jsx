import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import Button from "../common/Button";
import { toast } from "react-toastify";
import Input from "../common/Input";

export default function UpdateClassArmForm({ classArm, onSubmit, onCancel }) {
    const [className, setClassName] = useState(classArm?.className || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.put(`/class-arm/${classArm.classArmId}`, {
                yearLevelId: classArm.yearLevelId,
                className: className.trim(),
            });
            toast.info("Class name updated.");
            onSubmit(response.data.data); // Return updated data
        } catch (err) {
            console.error(err);
            setError("Failed to update class. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h3 className="font-semibold text-gray-600 mb-6">Edit Class</h3>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
                <Input
                    label="Class Name"
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="gray" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </Button>
            </div>
        </form>
    );
}
