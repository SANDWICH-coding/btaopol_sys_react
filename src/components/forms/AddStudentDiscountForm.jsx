import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';

// Skeleton component to show while loading
const SkeletonDiscount = () => (
  <div className="flex items-center gap-2 py-1 animate-pulse">
    <div className="w-4 h-4 bg-gray-300 rounded-sm" />
    <div className="h-4 w-48 bg-gray-300 rounded-md" />
  </div>
);

const AddStudentDiscountForm = ({ onSave, onClose, student }) => {
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);

        const discountsRes = await axiosInstance.get("/billing-discount");
        setAvailableDiscounts(discountsRes.data.data);

        const appliedRes = await axiosInstance.get(
          `/billing-discount-enrollment/${student.enrollmentId}`
        );
        const appliedDiscountIds = appliedRes.data.data;
        setSelectedDiscountIds(appliedDiscountIds);
      } catch (err) {
        console.error("Failed to fetch discounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [student.enrollmentId]);

  const handleCheckboxChange = (id) => {
    setSelectedDiscountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (selectedDiscountIds.length === 0) {
      const confirm = window.confirm("Are you sure you want to remove all discounts for this student?");
      if (!confirm) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await axiosInstance.post('/billing-discount-enrollment', {
        enrollmentId: student.enrollmentId,
        billingDiscountIds: selectedDiscountIds,
      });

      onSave();
      onClose();
    } catch (err) {
      console.error('Error applying discounts:', err);
      setError('Failed to apply discounts.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Apply Discounts</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {loading ? (
          // Render 4 skeletons while loading
          <>
            <SkeletonDiscount />
            <SkeletonDiscount />
            <SkeletonDiscount />
            <SkeletonDiscount />
          </>
        ) : availableDiscounts.length === 0 ? (
          <p className="text-gray-500 text-sm">No available discounts.</p>
        ) : (
          availableDiscounts.map((discount) => (
            <label key={discount.billingDiscountId} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={discount.billingDiscountId}
                checked={selectedDiscountIds.includes(discount.billingDiscountId)}
                onChange={() => handleCheckboxChange(discount.billingDiscountId)}
                className="form-checkbox"
              />
              <span>
                {discount.discountName} –{" "}
                {discount.discountType === 'fixed'
                  ? `₱${parseFloat(discount.discountValue).toFixed(2)}`
                  : `${discount.discountValue}%`}{" "}
                <span className="text-gray-500">({discount.appliesTo})</span>
              </span>
            </label>
          ))
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? 'Applying...'
            : selectedDiscountIds.length === 0
              ? 'Save Changes'
              : 'Apply Discounts'}
        </button>
      </div>
    </form>
  );
};

export default AddStudentDiscountForm;
