import React, { useState, useEffect, useMemo, useCallback } from "react";
import Button from "../common/Button";
import DataTable from "../common/DataTable";
import ModalForm from "../common/ModalForm";
import CreatePaymentForm from "../forms/CreatePaymentForm";
import SlidePanelBilling from "../common/SlidePanelBilling";
import axiosInstance from "../../axiosInstance";

const StudentBilling = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isSlideOpen, setIsSlideOpen] = useState(false);

    const handleOpenModal = () => setIsFormOpen(true);
    const handleCloseModal = () => setIsFormOpen(false);
    const handleCloseSlide = () => {
        setIsSlideOpen(false);
        setSelectedStudent(null);
    };

    const handleView = useCallback((row) => {
        setSelectedStudent(row);
        setIsSlideOpen(true);
    }, []);

    useEffect(() => {
        const fetchEnrollments = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get("/enrollment");
                setApiData(res.data);
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to fetch enrollment data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);


    const yearLevelMap = useMemo(() => {
        const map = {};
        apiData?.yearLevels?.forEach(({ yearLevelId, yearLevelName }) => {
            map[yearLevelId] = yearLevelName;
        });
        return map;
    }, [apiData]);

    const data = useMemo(() => {
        if (!apiData?.students) return [];

        return apiData.students.flatMap((student) =>
            student.enrollments.map((enrollment) => ({
                name: `${student.lastName}, ${student.firstName} ${student.middleName ?? ""} ${student.suffix ?? ""}`
                    .replace(/\s+/g, " ")
                    .trim(),
                avatar: student.profilePhoto
                    ? `http://localhost:8000/${student.profilePhoto}`
                    : "/default-avatar.png",
                email: student.lrn,
                yearLevelName: yearLevelMap[enrollment.yearLevelId] ?? "N/A",
                schoolYear: enrollment.schoolYearId,
                yearLevelId: enrollment.yearLevelId,
                enrollmentId: enrollment.enrollmentId,
            }))
        );
    }, [apiData, yearLevelMap]);

    const columns = useMemo(() => [
        {
            key: "name",
            label: "Name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        { key: "yearLevelName", label: "Year Level" },
        {
            key: "actions",
            label: "Action",
            render: (row) => (
                <button
                    className="text-blue-500 font-semibold text-xs bg-blue-100 border border-blue-500 rounded-full px-2 py-1"
                    onClick={() => handleView(row)}
                >
                    View
                </button>
            ),
        },
    ], [handleView]);

    const handleSubmit = async (formData) => {
        return
    };


    const SkeletonRow = () => (
        <div className="flex items-center gap-3 px-6 py-4 animate-pulse border-b">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <div className="flex-1 space-y-2">
                <div className="w-1/3 h-3 bg-gray-300 rounded" />
                <div className="w-1/4 h-3 bg-gray-200 rounded" />
            </div>
        </div>
    );

    const SkeletonTable = () => (
        <div>{Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} />)}</div>
    );

    return (
        <div>
            <div className="p-5 bg-white border mb-4 rounded-lg">
                <div className="flex items-start justify-between px-6 mb-6">
                    <div></div>
                    <Button
                        className="px-3 py-1"
                        variant="primary"
                        onClick={handleOpenModal}
                        size="md"
                    >
                        New Payment
                    </Button>
                </div>

                {loading && <SkeletonTable />}
                {!loading && error && (
                    <p className="text-red-500 px-6">Error: {error}</p>
                )}
                {!loading && !error && <DataTable columns={columns} data={data} />}
            </div>

            <ModalForm isOpen={isFormOpen} onClose={handleCloseModal}>
                <CreatePaymentForm onSave={handleSubmit} onClose={handleCloseModal} />
            </ModalForm>

            {isSlideOpen && selectedStudent && (
                <SlidePanelBilling student={selectedStudent} onClose={handleCloseSlide} />
            )}
        </div>
    );
};

export default StudentBilling;
