import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { toast } from 'react-toastify';
import Button from "../common/Button";
import Input from "../common/Input";

const CreateSchoolYearForm = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({
        yearStart: "",
        yearEnd: "",
    });

    const [errors, setErrors] = useState({});
    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(false); // <-- NEW

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "yearStart") {
            const numericValue = value.replace(/\D/g, "");
            const autoEnd = numericValue ? String(parseInt(numericValue) + 1) : "";
            setFormData({
                yearStart: numericValue,
                yearEnd: autoEnd,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value.replace(/\D/g, ""),
            });
        }

        setCustomError("");
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setCustomError("");

        const start = parseInt(formData.yearStart);
        const end = parseInt(formData.yearEnd);

        if (isNaN(start) || isNaN(end) || end <= start) {
            setCustomError("Year end must be greater than year start.");
            return;
        }

        setLoading(true); // <-- START loading
        try {
            const response = await axiosInstance.post("/school-year", formData);

            onSave && onSave(response.data);
            toast.success("Data successfully added!");

            setFormData({ yearStart: "", yearEnd: "" });
            onClose && onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("Failed to add data. Please try again!");
            }
        } finally {
            setLoading(false); // <-- STOP loading
        }
    };


    return (
        <div>
            <h4 className="font-semibold mb-6">Add New School Year</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input
                            label="Year Start"
                            type="text"
                            name="yearStart"
                            value={formData.yearStart}
                            onChange={handleChange}
                            error={errors.yearStart?.[0]}
                        />
                    </div>

                    <div>
                        <Input
                            label="Year End"
                            type="text"
                            name="yearEnd"
                            value={formData.yearEnd}
                            onChange={handleChange}
                            error={errors.yearEnd?.[0]}
                        />
                    </div>
                </div>

                {customError && (
                    <p className="text-sm text-red-600 text-left">{customError}</p>
                )}

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
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

export default CreateSchoolYearForm;
