import React from 'react'
import SchoolYearCardList from '../inside_sections/SchoolYearCardList'
import YearLevelClasses from '../inside_sections/YearLevelClasses'
import BillingConfiguration from '../inside_sections/BillingConfiguration'
import BillingDiscount from '../inside_sections/BillingDiscount'

const SchoolSection = () => {
    return (
        <div>
            <div className="p-5">
                <h1 className="font-medium mb-4">Manage School Year</h1>
                <SchoolYearCardList />
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 border-t py-9 lg:grid-cols-2 gap-9">
                    <div className="bg-white border mb-2 rounded-lg">
                        <h1 className="font-medium mt-8 mb-6 px-6 rounded-t-lg">Year Levels & Classes</h1>
                        <YearLevelClasses />
                    </div>

                    <div className="bg-white border mb-2 rounded-lg">
                        <h1 className="font-medium mt-8 mb-6 px-6 rounded-t-lg">Billing Configuration</h1>
                        <BillingConfiguration />
                    </div>

                    <div className="bg-white border mb-4 rounded-lg">
                        <h1 className="font-medium mt-8 mb-6 px-6 rounded-t-lg">Discount Previleges</h1>
                        <BillingDiscount />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SchoolSection
