// YearLevelClasses.jsx
import React from "react";

const YearLevelClassTable = ({ data, onCreateClass, onEdit, onDelete }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {data.map((group, idx) => (
        <div key={idx} className="bg-white shadow rounded-2xl border">
          {/* Year Level Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-t-2xl">
            <h2 className="text-lg font-semibold text-gray-800">{group.yearLevel}</h2>
            <button
              onClick={() => onCreateClass(group.yearLevel)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Create New Class
            </button>
          </div>

          {/* Classes List */}
          <div className="divide-y">
            {group.classes.length === 0 ? (
              <div className="px-6 py-4 text-gray-500 italic">No classes available</div>
            ) : (
              group.classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <span className="text-gray-700">{cls.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => onEdit(cls)}
                      className="px-3 py-1 text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(cls)}
                      className="px-3 py-1 text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearLevelClassTable;
