import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../common/Button";
import ModalForm from "../common/ModalForm";
import CreateYearLevelForm from "../forms/CreateYearLevelForm";
import CreateClassArmForm from "../forms/CreateClassArmForm";
import { MdFormatListBulletedAdd } from "react-icons/md";
import UpdateClassArmForm from "../forms/UpdateClassArmForm";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 2;

export default function YearLevelClasses() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isYearLevelFormOpen, setIsYearLevelFormOpen] = useState(false);
    const [isClassFormOpen, setIsClassFormOpen] = useState(false);
    const [selectedYearLevel, setSelectedYearLevel] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [classToEdit, setClassToEdit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/year-level");
                setData(response.data);
            } catch (err) {
                setError("Failed to fetch data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddClassArm = (newClassArm) => {
        setData(prevData =>
            prevData.map(yl => {
                if (yl.yearLevelId === newClassArm.yearLevelId) {
                    return {
                        ...yl,
                        class_arms: [...(yl.class_arms || []), newClassArm]
                    };
                }
                return yl;
            })
        );
        setIsClassFormOpen(false);
    };

    const handleSave = (newYearLevel) => {
        const updatedData = [...data, { ...newYearLevel, class_arms: [] }];
        setData(updatedData);
        const totalPages = Math.ceil(updatedData.length / ITEMS_PER_PAGE);
        setCurrentPage(totalPages);
        setIsYearLevelFormOpen(false);
    };

    const handleEdit = (cls) => {
        setClassToEdit(cls);
        setIsEditFormOpen(true);
    };

    const handleUpdateClassArm = (updatedClassArm) => {
        setData(prevData =>
            prevData.map(yl => {
                if (yl.yearLevelId === updatedClassArm.yearLevelId) {
                    return {
                        ...yl,
                        class_arms: yl.class_arms.map(cls =>
                            cls.classArmId === updatedClassArm.classArmId ? updatedClassArm : cls
                        )
                    };
                }
                return yl;
            })
        );
        setIsEditFormOpen(false);
    };


    const handleDelete = async (cls) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/class-arm/${cls.classArmId}`);

            setData(prevData =>
                prevData.map(yl => {
                    if (yl.yearLevelId === cls.yearLevelId) {
                        return {
                            ...yl,
                            class_arms: yl.class_arms.filter(c => c.classArmId !== cls.classArmId)
                        };
                    }
                    return yl;
                })
            );
            toast.info("Class removed.");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete the class.");
        }
    };


    // Skeleton loading
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                {[...Array(1)].map((_, index) => (
                    <div key={index} className="bg-white border rounded animate-pulse">
                        <div className="flex justify-between items-center p-4 bg-gray-100">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) return <div className="text-red-500">{error}</div>;

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const paginatedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-5xl mx-auto">
            {paginatedData.map((group) => (
                <div key={group.yearLevelId} className="bg-white px-6">
                    <div className="flex items-center justify-between border-t border-b bg-gray-100">
                        <h4 className="font-medium text-sm px-2 text-gray-800">{group.yearLevelName}</h4>
                        <Button
                            onClick={() => { setSelectedYearLevel(group); setIsClassFormOpen(true); }}
                            variant="ghost"
                            size="md"
                            className="text-xl"
                        >
                            <MdFormatListBulletedAdd />
                        </Button>
                    </div>

                    <div className="divide-y">
                        {group.class_arms.length === 0 ? (
                            <div className="text-sm px-6 py-2 text-gray-500 italic">No classes available</div>
                        ) : (
                            group.class_arms.map((cls) => (
                                <div
                                    key={cls.classArmId}
                                    className="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
                                >
                                    <span className="text-sm px-2 text-gray-700">{cls.className}</span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handleEdit(cls)}
                                            className="px-3 py-1 text-sm text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cls)}
                                            className="px-3 py-1 text-sm text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 my-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1.5 text-xs border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 text-sm py-1">{currentPage} / {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1.5 text-xs border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Create New Year Level Card */}
            <div className="bg-white-100 text-center mt-6 rounded-b-lg">
                <div className="py-3">
                    <Button
                        onClick={() => setIsYearLevelFormOpen(true)}
                        variant="grayTrans"
                        size="sm"
                        className="bg-white shadow rounded-lg p-5 flex items-center justify-center hover:shadow-md cursor-pointer transition border-dashed border-2 border-gray-300"
                    >
                        + Year Level
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <ModalForm isOpen={isYearLevelFormOpen} onClose={() => setIsYearLevelFormOpen(false)}>
                <CreateYearLevelForm onSave={handleSave} onClose={() => setIsYearLevelFormOpen(false)} />
            </ModalForm>

            <ModalForm isOpen={isClassFormOpen} onClose={() => setIsClassFormOpen(false)}>
                <CreateClassArmForm
                    onSubmit={handleAddClassArm}
                    onCancel={() => setIsClassFormOpen(false)}
                    yearLevelId={selectedYearLevel?.yearLevelId}
                    yearLevelName={selectedYearLevel?.yearLevelName}
                />
            </ModalForm>

            <ModalForm isOpen={isEditFormOpen} onClose={() => setIsEditFormOpen(false)}>
                <UpdateClassArmForm
                    classArm={classToEdit}
                    onSubmit={handleUpdateClassArm}
                    onCancel={() => setIsEditFormOpen(false)}
                />
            </ModalForm>
        </div>
    );
}
