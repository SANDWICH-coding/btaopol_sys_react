import React, { useState, useEffect, useMemo, useCallback } from "react";
import Button from "../common/Button";
import DataTable from "../common/DataTable";
import ModalForm from "../common/ModalForm";
import CreateEnrollmentForm from "../forms/CreateEnrollmentForm";
import { toast } from "react-toastify";
import SlidePanel from "../common/SlidePanel";

const StudentEnrollment = () => {
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
                const res = await fetch("http://localhost:8000/api/enrollment");
                if (!res.ok) throw new Error("Failed to fetch enrollment data.");
                const data = await res.json();
                setApiData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
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

    const classArmMap = useMemo(() => {
        const map = {};
        apiData?.classArms?.forEach(({ classArmId, className }) => {
            map[classArmId] = className;
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
                classArmName: classArmMap[enrollment.classArmId] ?? "N/A",
                enrollmentType: enrollment.enrollmentType,
                enrollmentNumber: enrollment.enrollmentNumber,
                schoolYear: enrollment.schoolYearId,
                yearLevelId: enrollment.yearLevelId,
                enrollmentId: enrollment.enrollmentId,
            }))
        );
    }, [apiData, yearLevelMap, classArmMap]);

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
        { key: "classArmName", label: "Class" },
        { key: "enrollmentType", label: "Type" },
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
        try {
            const response = await fetch("http://localhost:8000/api/enrollment", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to enroll student.");
            }

            toast.success("Student enrolled successfully!");
            setIsFormOpen(false);

            const { student: newStudent, enrollment: newEnrollment } = result;

            setApiData((prev) => {
                if (!prev) return prev;

                const existingStudentIndex = prev.students.findIndex(
                    (s) => s.studentId === newStudent.studentId
                );

                if (existingStudentIndex !== -1) {
                    const updatedStudents = [...prev.students];
                    updatedStudents[existingStudentIndex].enrollments.push(newEnrollment);
                    return { ...prev, students: updatedStudents };
                }

                return {
                    ...prev,
                    students: [...prev.students, { ...newStudent, enrollments: [newEnrollment] }],
                };
            });
        } catch (err) {
            toast.error(err.message || "Enrollment failed.");
            console.error(err);
        }
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
                    <h1 className="font-medium text-xl">Manage Enrollment</h1>
                    <Button
                        className="px-3 py-1"
                        variant="primary"
                        onClick={handleOpenModal}
                        size="md"
                    >
                        Enroll Student
                    </Button>
                </div>

                {loading && <SkeletonTable />}
                {!loading && error && (
                    <p className="text-red-500 px-6">Error: {error}</p>
                )}
                {!loading && !error && <DataTable columns={columns} data={data} />}
            </div>

            <ModalForm isOpen={isFormOpen} onClose={handleCloseModal}>
                <CreateEnrollmentForm onSave={handleSubmit} onClose={handleCloseModal} />
            </ModalForm>

            {isSlideOpen && selectedStudent && (
                <SlidePanel student={selectedStudent} onClose={handleCloseSlide} />
            )}
        </div>
    );
};

export default StudentEnrollment;
