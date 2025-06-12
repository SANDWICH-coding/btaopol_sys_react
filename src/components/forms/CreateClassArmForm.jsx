import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import axiosInstance from '../../axiosInstance';

const CreateClassArmForm = ({ onSubmit, onCancel, yearLevelId, yearLevelName }) => {
    const [formData, setFormData] = useState({
        className: '',
    });

    const [errors, setErrors] = useState({});
    const [customError, setCustomError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setCustomError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setCustomError('');

        if (!formData.className) {
            setCustomError('Please enter a class name.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                yearLevelId,
            };

            const res = await axiosInstance.post('/class-arm', payload);

            toast.success('Class created successfully!');
            onSubmit && onSubmit(res.data.data);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setCustomError('Failed to create class.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <h3 className="font-semibold text-gray-600 mb-6">
                Create New Class: <span className="text-blue-700">{yearLevelName}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Class Name"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    error={errors.className?.[0]}
                />

                {customError && (
                    <p className="text-sm text-red-600 text-right">{customError}</p>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
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
                            'Save'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateClassArmForm;
