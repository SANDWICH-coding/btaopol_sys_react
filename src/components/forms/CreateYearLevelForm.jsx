import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import Button from "../common/Button";
import Input from "../common/Input";
import { toast } from 'react-toastify';

const CreateYearLevelForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    yearLevelName: "",
  });

  const [errors, setErrors] = useState({});
  const [customError, setCustomError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setCustomError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setCustomError("");

    if (!formData.yearLevelName.trim()) {
      setCustomError("Year level name is required.");
      return;
    }

    setLoading(true); // <-- START loading
    try {
      const response = await axiosInstance.post("/year-level", formData);

      onSave && onSave(response.data);
      toast.success('New year level created!');

      setFormData({ yearLevelName: "" });
      onClose && onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Failed to create year level.");
      }
    } finally {
      setLoading(false); // <-- STOP loading
    }
  };


  return (
    <div>
      <h4 className="font-semibold mb-6">Add New Year Level</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Input
              label="Year Level"
              type="text"
              name="yearLevelName"
              value={formData.yearLevelName}
              onChange={handleChange}
              error={errors.yearLevelName?.[0]}
            />
          </div>
        </div>

        {customError && (
          <p className="text-sm text-red-600 text-right">{customError}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
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

export default CreateYearLevelForm;
