import React from 'react';

const AddDonationButton = ({ onClick }) => {
  return (
    <button
      className="btn mt-4"
      onClick={onClick}
    >
      Add Donation
    </button>
  );
};

export default AddDonationButton;