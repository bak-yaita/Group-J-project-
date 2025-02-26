import React from 'react'
import Cards from '../../components/cards'
import Wrapper from '../../components/wrapper'
const StudentDashboard = () => {
  return (
    <Wrapper>
    <div className='m-2'>
        
      <div className='mt-4 mb-4 flex flex-col gap-2 md:flex-row flexgap-4 md:justify-between'>
                <Cards
                title="Total Issues"
                number= "12"
                />
                <Cards
                title="Total Issues"
                number= "12"
                />
                <Cards
                title="Total Issues"
                number= "12"
                />
       
      </div>
      <div className='space-y-4'>
        <p className='text-2xl font'>Recent Issues</p>
        

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Issue_id
                </th>
                <th scope="col" className="px-6 py-3">
                    Course_code
                </th>
                <th scope="col" className="px-6 py-3">
                    Issue_type
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Last_update
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            
            
        </tbody>
    </table>
</div>

      </div>
    </div>
    </Wrapper>
  )
}

export default StudentDashboard

