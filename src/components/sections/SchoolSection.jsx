import { useState } from "react";
import SchoolYearCardList from '../inside_sections/SchoolYearCardList'
import YearLevelClasses from '../inside_sections/YearLevelClasses'
import BillingConfiguration from '../inside_sections/BillingConfiguration'
import BillingDiscount from '../inside_sections/BillingDiscount'
import { ChevronDown, ChevronUp } from "lucide-react";

const DropdownSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border rounded-lg">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left flex justify-between items-center px-6 py-4 border-b font-medium hover:bg-gray-50 transition"
            >
                <span>{title}</span>
                {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {open && <div className="pt-6 pb-6">{children}</div>}
        </div>
    );
};

const SchoolSection = () => {
    return (
        <div>
            <div className="p-5">
                <h1 className="font-medium mb-4">Manage School Year</h1>
                <SchoolYearCardList />
            </div>

            <div className="p-5">
                <div className="space-y-4 border-t py-9">
                    <DropdownSection title="Year Levels & Classes">
                        <YearLevelClasses />
                    </DropdownSection>

                    <DropdownSection title="Billing Configuration">
                        <BillingConfiguration />
                    </DropdownSection>

                    <DropdownSection title="Discount Previleges">
                        <BillingDiscount />
                    </DropdownSection>
                </div>
            </div>


        </div>
    )
}

export default SchoolSection
