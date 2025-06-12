import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../axiosInstance";
import ModalForm from "../common/ModalForm";
import AddStudentDiscountForm from "../forms/AddStudentDiscountForm";
import Button from "../common/Button";

const SkeletonTable = () => (
    <div className="animate-pulse space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center border-b py-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
        ))}
    </div>
);

const SlidePanelBilling = ({ student, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [billingConfigs, setBillingConfigs] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [billingRes, discountRes, paymentRes] = await Promise.all([
                axiosInstance.get("/billing-configuration"),
                axiosInstance.get("/billing-discount-enrollment"),
                axiosInstance.get("/payment"),
            ]);

            const allConfigs = billingRes.data;
            const matchingConfigs = allConfigs.filter(
                (config) =>
                    config.schoolYearId === student.schoolYear &&
                    config.yearLevelId === student.yearLevelId
            );
            setBillingConfigs(matchingConfigs);

            const allDiscounts = discountRes.data;
            const matchingDiscounts = allDiscounts.filter(
                (d) => d.enrollmentId === student.enrollmentId
            );
            setDiscounts(matchingDiscounts);

            const allPayments = paymentRes.data.data;
            const matchingPayments = allPayments.filter(
                (p) => p.enrollmentId === student.enrollmentId
            );
            setPayments(matchingPayments);
        } catch (error) {
            console.error("Error fetching billing data:", error);
        } finally {
            setLoading(false);
        }
    }, [student.schoolYear, student.yearLevelId, student.enrollmentId]);

    useEffect(() => {
        setVisible(true);
        fetchData();
    }, [fetchData]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleOpenModal = () => setIsFormOpen(true);
    const handleCloseModal = () => setIsFormOpen(false);

    const handleSaveDiscounts = async () => {
        await fetchData();
        handleCloseModal();
    };

    const billingWithDiscounts = billingConfigs.map((config) => {
        const billingItem = config.billing_items;
        const appliesTo = billingItem?.category;
        const itemAmount = parseFloat(config.amount || 0);

        const applicableDiscounts = discounts.filter(
            (d) => d.billing_discount?.appliesTo === appliesTo
        );

        const totalDiscount = applicableDiscounts.reduce((sum, d) => {
            const disc = d.billing_discount;
            if (!disc) return sum;
            if (disc.discountType === "fixed") {
                return sum + parseFloat(disc.discountValue || 0);
            } else if (disc.discountType === "percentage") {
                return sum + (itemAmount * parseFloat(disc.discountValue || 0)) / 100;
            }
            return sum;
        }, 0);

        return {
            name: billingItem?.billItem || "Unnamed Item",
            amountAfterDiscount: itemAmount - totalDiscount,
            amount: itemAmount,
            totalDiscount,
        };
    });

    const totalBilling = billingWithDiscounts.reduce((sum, item) => sum + item.amount, 0);
    const totalDiscount = billingWithDiscounts.reduce((sum, item) => sum + item.totalDiscount, 0);
    const totalAfterDiscount = totalBilling - totalDiscount;
    

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={handleClose} />

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Student Account</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-red-500 text-2xl font-semibold">
                        &times;
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="w-full max-w-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg p-6 relative mb-6">
                        <div className="w-10 h-7 bg-yellow-300 rounded-sm mb-6"></div>
                        <p className="text-xs opacity-70">ACCOUNT HOLDER</p>
                        <p className="font-medium">{student.name}</p>

                        <div className="border-t border-white opacity-30 my-4"></div>
                        <div className="flex justify-between text-sm">
                            <div>
                                <p className="text-xs opacity-70">YEAR LEVEL</p>
                                <p className="font-medium">{student.yearLevelName}</p>
                            </div>
                        </div>
                        <div className="absolute top-6 right-6 text-xs font-bold tracking-wide text-white/80">
                            <img src="/default-logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                        </div>
                    </div>

                    {/* Billing Table */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-3">
                            <div></div>
                            <Button
                                className="px-3 py-1"
                                variant="outline"
                                onClick={handleOpenModal}
                                size="sm"
                            >
                                Manage Discount
                            </Button>
                        </div>

                        {loading ? (
                            <SkeletonTable />
                        ) : billingWithDiscounts.length === 0 ? (
                            <p className="text-gray-500">No billing configurations found for this student.</p>
                        ) : (
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-4 py-2 border-b">Item</th>
                                            <th className="px-4 py-2 border-b text-left">Amount</th>
                                            <th className="px-4 py-2 border-b text-left">Discount</th>
                                            <th className="px-4 py-2 border-b text-right">Total Payable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billingWithDiscounts.map((item, index) => {
                                            const relatedDiscounts = discounts.filter(
                                                (d) => d.billing_discount?.appliesTo === item.name
                                            );

                                            const discountDescriptions = relatedDiscounts.map((d) => {
                                                const disc = d.billing_discount;
                                                if (!disc) return null;

                                                const valueDisplay =
                                                    disc.discountType === "fixed"
                                                        ? `₱${parseFloat(disc.discountValue).toFixed(2)}`
                                                        : `${parseFloat(disc.discountValue)}%`;

                                                return `${disc.discountName} – ${valueDisplay}`;
                                            }).filter(Boolean);

                                            const hasDiscount = item.totalDiscount > 0;

                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 border-b">{item.name}</td>
                                                    <td className="px-4 py-2 border-b text-left">₱{item.amount.toFixed(2)}</td>
                                                    <td className="px-4 py-2 border-b text-left text-green-600 whitespace-pre-line">
                                                        {hasDiscount ? (
                                                            <>
                                                                ₱{item.totalDiscount.toFixed(2)}
                                                                {discountDescriptions.length > 0 && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {discountDescriptions.map((desc, i) => (
                                                                            <div key={i}>{desc}</div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">–</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 border-b text-right font-medium text-blue-600">
                                                        ₱{item.amountAfterDiscount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                    <tfoot className="bg-gray-50 text-gray-800 font-semibold">
                                        <tr>
                                            <td className="px-4 py-2 border-t">Total</td>
                                            <td className="px-4 py-2 border-t text-left">₱{totalBilling.toFixed(2)}</td>
                                            <td className="px-4 py-2 border-t text-left text-green-700">
                                                {totalDiscount > 0 ? `₱${totalDiscount.toFixed(2)}` : "–"}
                                            </td>
                                            <td className="px-4 py-2 border-t text-right text-blue-700">
                                                ₱{totalAfterDiscount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Payment Table */}
                    <div className="mb-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-3">Payment Records</h3>
                        {loading ? (
                            <SkeletonTable />
                        ) : payments.length === 0 ? (
                            <p className="text-gray-500">No payment records found.</p>
                        ) : (
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-4 py-2 border-b">Date</th>
                                            <th className="px-4 py-2 border-b">Receipt #</th>
                                            <th className="px-4 py-2 border-b">Billing Item</th>
                                            <th className="px-4 py-2 border-b text-right">Amount Paid</th>
                                            <th className="px-4 py-2 border-b">Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border-b">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-2 border-b">{payment.receiptNumber}</td>
                                                <td className="px-4 py-2 border-b">{payment.billing_configuration?.billing_items?.billItem || "N/A"}</td>
                                                <td className="px-4 py-2 border-b text-right text-blue-600 font-medium">₱{parseFloat(payment.amountPaid).toFixed(2)}</td>
                                                <td className="px-4 py-2 border-b">{payment.paymentMethod || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalForm isOpen={isFormOpen} onClose={handleCloseModal}>
                <AddStudentDiscountForm
                    onSave={handleSaveDiscounts}
                    onClose={handleCloseModal}
                    student={student}
                />
            </ModalForm>
        </>
    );
};

export default SlidePanelBilling;
