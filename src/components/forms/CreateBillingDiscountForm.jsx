import { useState } from "react";
import axios from "axios";
import Button from "../common/Button";
import Input from "../common/Input";
import Dropdown from "../common/Dropdown";

const discountTypeOptions = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];

const appliesToOptions = [
  { label: "Tuition", value: "Tuition" },
  { label: "Registration", value: "Registration" },
  { label: "Miscellaneous", value: "Miscellaneous" },
  { label: "Books", value: "Books" },
  { label: "Others", value: "Others" },
];

const CreateBillingDiscountForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    discountName: "",
    discountDiscription: "",
    discountType: discountTypeOptions[0],
    discountValue: "",
    appliesTo: appliesToOptions[0],
  });

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (field) => (item) => {
    setFormData((prev) => ({ ...prev, [field]: item }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
      discountType: formData.discountType.value,
      appliesTo: formData.appliesTo.value,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/billing-discount", payload);
      onSave(response.data.data);
    } catch (err) {
      setError("Failed to create discount.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Add Billing Discount</h2>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Input
        name="discountName"
        label="Name"
        value={formData.discountName}
        onChange={handleChange}
        required
      />

      <Input
        name="discountDiscription"
        label="Description"
        value={formData.discountDiscription}
        onChange={handleChange}
      />

      <div className="flex items-center gap-5">
        <Dropdown
          label="Type"
          items={discountTypeOptions}
          selectedItem={formData.discountType}
          onSelect={handleDropdownChange("discountType")}
        />

        <Input
          type="number"
          name="discountValue"
          label="Value"
          value={formData.discountValue}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>


      <Dropdown
        label="Applies To"
        items={appliesToOptions}
        selectedItem={formData.appliesTo}
        onSelect={handleDropdownChange("appliesTo")}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBillingDiscountForm;
