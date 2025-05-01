import React from 'react'
// actual componet
const Cards = ( {title, number, text}) => {
  return (
    <div>
        <a href="#" class="block max-w-xl p-6  border border-gray-200  shadow-sm hover:bg-gray-100 dark:bg-blue-950 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{title}</h5>
        <p className="font-normal text-black-700 dark:text-gray-400 text-center">{number}</p>
        <p className="text-xs text-gray-500 mt-1">{text}</p>
                
              
        </a>
    </div>
  )
}

export default Cards
