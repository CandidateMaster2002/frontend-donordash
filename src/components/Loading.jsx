import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loading = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ThreeDots 
        height="80" 
        width="80" 
        color="#4fa94d" 
        ariaLabel="three-dots-loading" 
        visible={true} 
      />
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  );
};

export default Loading;
