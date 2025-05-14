import React from 'react'
import Button from '../common/Button'
import DataTable from '../common/DataTable'

const StudentEnrollment = () => {
    return (
        <div>
            <div className="relative">
                <div className="p-5 bg-white border mb-4 rounded-lg">
                    {/* Header and Button aligned in one row */}
                    <div className="flex items-start justify-between mb-6">
                        <h1 className="font-medium text-base">Manage Enrollment</h1>
                        <Button
                            className="px-3 py-1"
                            variant="primary"
                            onClick={() => alert('Button clicked')}
                            size="sm"
                        >
                            Enroll student
                        </Button>
                    </div>

                    <DataTable
                        columns={[
                            {
                                key: "name",
                                label: "Name",
                                render: (row) => (
                                    <div className="flex items-center gap-3">
                                        <img src={row.avatar} alt="" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-medium">{row.name}</p>
                                            <p className="text-xs text-gray-500">{row.email}</p>
                                        </div>
                                    </div>
                                ),
                            },
                            { key: "role", label: "Role" },
                        ]}
                        data={[
                            {
                                name: "Lan Doe",
                                email: "john@example.com",
                                avatar: "/avatar1.png",
                                role: "Student",
                            },
                            {
                                name: "John Doe",
                                email: "john@example.com",
                                avatar: "/avatar1.png",
                                role: "Admin",
                            }, {
                                name: "Ran Doe",
                                email: "john@example.com",
                                avatar: "/avatar1.png",
                                role: "Student",
                            },

                        ]}
                    />


                </div>
            </div>


        </div>
    )
}

export default StudentEnrollment
