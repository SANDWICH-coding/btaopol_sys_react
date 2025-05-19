import React from 'react'
import StudentEnrollment from '../inside_sections/StudentEnrollment'

const StudentSection = () => {
    return (
        <div>
            <div className="p-5">
                <div className='grid grid-cols-1 lg:grid-cols-1 gap-9'>
                    <StudentEnrollment />
                </div>
            </div>
        </div>
    )
}

export default StudentSection
