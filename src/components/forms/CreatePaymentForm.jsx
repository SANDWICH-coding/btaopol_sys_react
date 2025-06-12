import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import DropdownWithSearch from "../common/DropdownWithSearch";

const CreatePaymentForm = () => {
  const [formData, setFormData] = useState({
    enrollmentId: "",
    paymentDate: "",
    receiptNumber: "",
    paymentMethod: "",
    notes: "",
  });

  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [enrollmentOptions, setEnrollmentOptions] = useState([]);
  const [studentsMap, setStudentsMap] = useState([]);
  const [billingConfigs, setBillingConfigs] = useState([]);
  const [filteredConfigs, setFilteredConfigs] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axiosInstance.get("/enrollment");
        const students = res.data.students || [];

        setStudentsMap(students); // Save for later lookup

        const options = students
          .filter((student) => student.enrollments.length > 0)
          .map((student) => {
            const enrollment = student.enrollments[0];
            return {
              value: enrollment.enrollmentId,
              label: `${student.lastName}, ${student.firstName}`,
            };
          });

        setEnrollmentOptions(options);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      }
    };

    fetchEnrollments();
  }, []);

  // Fetch billing configurations once
  useEffect(() => {
    const fetchBillingConfigs = async () => {
      try {
        const res = await axiosInstance.get("/billing-configuration");
        setBillingConfigs(res.data);
      } catch (error) {
        console.error("Failed to fetch billing configurations:", error);
      }
    };

    fetchBillingConfigs();
  }, []);

  // Handle student selection
  const handleEnrollmentSelect = (item) => {
    setSelectedEnrollment(item);
    setFormData({ ...formData, enrollmentId: item.value });

    // Find selected student's enrollment
    const student = studentsMap.find((s) =>
      s.enrollments.some((e) => e.enrollmentId === item.value)
    );
    const enrollment = student?.enrollments?.find(
      (e) => e.enrollmentId === item.value
    );

    if (enrollment) {
      const yearLevelId = enrollment.yearLevelId;
      const schoolYearId = enrollment.schoolYearId;

      const filtered = billingConfigs.filter(
        (config) =>
          config.yearLevelId === yearLevelId &&
          config.schoolYearId === schoolYearId
      );

      setFilteredConfigs(filtered);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (billingConfigId, value) => {
    setAmounts((prev) => ({
      ...prev,
      [billingConfigId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const billingDetails = Object.entries(amounts).map(
      ([billingConfigId, amount]) => ({
        billingConfigId: parseInt(billingConfigId),
        amountPaid: parseFloat(amount),
      })
    );

    try {
      const response = await axiosInstance.post("/payment", {
        ...formData,
        billingDetails,
      });

      setSuccessMessage(response.data.message);

      // Reset form
      setFormData({
        enrollmentId: "",
        paymentDate: "",
        receiptNumber: "",
        paymentMethod: "",
        notes: "",
      });
      setSelectedEnrollment(null);
      setFilteredConfigs([]);
      setAmounts({});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4 border rounded shadow w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Payment</h2>

      {successMessage && (
        <div className="p-2 bg-green-100 text-green-700 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <DropdownWithSearch
          label="Select Student Enrollment"
          items={enrollmentOptions}
          selectedItem={selectedEnrollment}
          onSelect={handleEnrollmentSelect}
          error={errors.enrollmentId}
        />

        <div>
          <label>Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.paymentDate && (
            <small className="text-red-500">{errors.paymentDate[0]}</small>
          )}
        </div>

        <div>
          <label>Receipt Number</label>
          <input
            type="text"
            name="receiptNumber"
            value={formData.receiptNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.receiptNumber && (
            <small className="text-red-500">
              {errors.receiptNumber[0]}
            </small>
          )}
        </div>

        {filteredConfigs.length > 0 && (
          <div className="space-y-2">
            <label className="block font-semibold">Billing Items</label>
            {filteredConfigs.map((config) => (
              <div
                key={config.billingConfigId}
                className="flex items-center gap-2"
              >
                <span className="flex-1">
                  {config.billing_items?.billItem || "Unnamed Item"}
                </span>
                <input
                  type="number"
                  value={amounts[config.billingConfigId] || ""}
                  onChange={(e) =>
                    handleAmountChange(config.billingConfigId, e.target.value)
                  }
                  onWheel={(e) => e.target.blur()} // disables scroll changes
                  className="w-32 p-2 border rounded"
                />

              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Check">Check</option>
          </select>
        </div>


        <div>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default CreatePaymentForm;
