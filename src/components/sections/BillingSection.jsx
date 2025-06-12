import StudentBilling from '../inside_sections/StudentBilling'

const BillingSection = () => {
  return (
    <div>
      <div>
        <div className="p-5">
          <div className='grid grid-cols-1 lg:grid-cols-1 gap-9'>
            <StudentBilling />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingSection
