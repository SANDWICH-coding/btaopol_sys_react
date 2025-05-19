import React, { useEffect, useState } from "react";

const SlidePanel = ({ student, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        setVisible(true);
    }, []);

    const handleClose = () => {
        // Animate out first, then close
        setVisible(false);
        setTimeout(onClose, 300); // match transition duration
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                onClick={handleClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300 ${
                    visible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">About Student</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-red-500 text-2xl font-semibold">
                        &times;
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-gray-100 rounded-xl p-5 flex flex-col items-center mt-6 text-center">
                        <img
                            src={student.avatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md -mt-12"
                        />
                        <h3 className="mt-4 text-xl font-semibold text-gray-800">{student.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{student.email}</p>

                        <div className="w-full mt-4 space-y-3 text-left text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold text-gray-400">LEVEL</span>
                                <span>{student.yearLevelName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold text-gray-400">CLASS</span>
                                <span>{student.classArmName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold text-gray-400">TYPE</span>
                                <span>{student.enrollmentType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold text-gray-400">E NUMBER</span>
                                <span>{student.enrollmentNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SlidePanel;
