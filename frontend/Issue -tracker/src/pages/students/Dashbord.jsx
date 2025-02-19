import React from 'react'
import Cards from '../../components/cards'

const StudentDashboard = () => {
  return (
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
        

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Issue_id
                </th>
                <th scope="col" class="px-6 py-3">
                    Course_code
                </th>
                <th scope="col" class="px-6 py-3">
                    Issue_type
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
                <th scope="col" class="px-6 py-3">
                    Last_update
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            
            
        </tbody>
    </table>
</div>

      </div>
    </div>
  )
}

export default StudentDashboard

