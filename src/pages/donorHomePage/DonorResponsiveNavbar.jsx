import React from 'react';

const DonorResponsiveNavbar = ({ selectedPage, setSelectedPage }) => {
  const navItems = [
    { name: 'Donate Now', label: 'Donate Now' },
    { name: 'Donation History', label: 'Donation History' }
  ];

  return (
    <nav className="bg-gray-800 text-white w-full md:w-64 md:min-h-screen">
      <ul className="flex md:flex-col">
        {navItems.map((item) => (
          <li
            key={item.name}
            className={`w-full md:w-auto ${selectedPage === item.name ? 'bg-blue-500' : 'hover:bg-gray-700'} p-4 cursor-pointer`}
            onClick={() => setSelectedPage(item.name)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DonorResponsiveNavbar;