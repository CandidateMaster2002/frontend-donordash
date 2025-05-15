import React from 'react'

const SortByButtons = ({setSortOption,sortOption}) => {


    const options = ["cultivator", "amount", "date"];
    
  return (
     <div className="flex justify-end items-center space-x-4 my-4">
        <span className="font-bold text-purple-800">Sort By:</span>
       {options.map((option) => (
        <button
            key={option}
            className={`py-2 px-2 rounded-lg shadow text-sm ${
                sortOption === option
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-purple-800"
            }`}
            onClick={() => setSortOption(option)}
        >
            {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
       ))}
      </div>
  )
}

export default SortByButtons
