import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { FiToggleLeft, FiToggleRight, FiPlusSquare } from "react-icons/fi";
import ModalForm from "../common/ModalForm";
import CreateSchoolYearForm from "../forms/CreateSchoolYearForm";
import { LuSchool } from "react-icons/lu";

const SkeletonCard = () => (
    <div className="bg-white shadow rounded-lg p-4 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div className="flex flex-col gap-2">
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 w-6 h-6 bg-gray-300 rounded-full ml-auto"></div>
        </div>
    </div>
);

const SchoolYearCard = ({schoolYear, isActive, onToggle }) => {
    return (
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border flex items-center justify-center">
                    <LuSchool className="text-gray-600 w-8 h-8" />
                </div>
                <div>
                    <p className="text-gray-800 font-medium text-lg">{schoolYear}</p>
                    <p className="text-sm text-gray-500">{isActive ? "Active" : "Inactive"}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`text-2xl transition ${isActive
                    ? "text-green-500 hover:text-green-600"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
            >
                {isActive ? <FiToggleRight /> : <FiToggleLeft />}
            </button>
        </div>
    );
};

const SchoolYearCardList = () => {
    const [schoolYears, setSchoolYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchSchoolYears();
    }, []);

    const fetchSchoolYears = () => {
        setLoading(true);
        axios
            .get("http://localhost:8000/api/school-year")
            .then((response) => {
                const formatted = response.data.map((item) => ({
                    id: item.schoolYearId,
                    yearStart: item.yearStart,
                    yearEnd: item.yearEnd,
                    isActive: item.status === 1,
                }));
                setSchoolYears(formatted);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch data");
                setLoading(false);
            });
    };

    const handleSave = (newSchoolYear) => {
        setSchoolYears((prev) => [
            ...prev.map(sy => ({ ...sy, isActive: false })),
            {
                id: newSchoolYear.schoolYearId,
                yearStart: newSchoolYear.yearStart,
                yearEnd: newSchoolYear.yearEnd,
                isActive: newSchoolYear.status === 0
            }
        ]);
        setIsFormOpen(false);
    };

    const handleToggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus ? 0 : 1;

        axios
            .patch(`http://localhost:8000/api/school-year/${id}`, { status: newStatus })
            .then(() => {
                toast.success(`School year ${newStatus === 1 ? 'activated' : 'deactivated'} successfully!`);
                setSchoolYears((prev) =>
                    prev.map((sy) =>
                        sy.id === id
                            ? { ...sy, isActive: newStatus === 1 }
                            : newStatus === 1
                                ? { ...sy, isActive: false }
                                : sy
                    )
                );
            })
            .catch(() => {
                toast.error("Failed to update school year status.");
            });
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                Array.from({ length: 1 }).map((_, idx) => <SkeletonCard key={idx} />)
            ) : (
                schoolYears.map((sy) => (
                    <SchoolYearCard
                        key={sy.id}
                        logo={null}
                        schoolYear={`${sy.yearStart} - ${sy.yearEnd}`}
                        isActive={sy.isActive}
                        onToggle={() => handleToggleStatus(sy.id, sy.isActive)}
                    />
                ))
            )}

            {/* Create New School Year Button */}
            {!loading && (
                <div
                    onClick={() => setIsFormOpen(true)}
                    className="bg-white shadow rounded-lg p-5 hover:border-blue-500 flex items-center justify-center hover:shadow-md cursor-pointer transition border-dashed border-2 border-gray-300"
                >
                    <FiPlusSquare className="text-2xl text-blue-500 mr-2" />
                    <p className="text-blue-500 text-lg font-medium">Create New</p>
                </div>
            )}

            {/* Modal Form */}
            <ModalForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
                <CreateSchoolYearForm onSave={handleSave} onClose={() => setIsFormOpen(false)} />
            </ModalForm>
        </div>
    );
};

export default SchoolYearCardList;
