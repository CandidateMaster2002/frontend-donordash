// src/components/Loader.jsx
import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
    <div className="relative">
      {/* Main spinner */}
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full animate-pulse shadow-[0_0_15px_5px_rgba(168,85,247,0.6)]"></div>
      
      {/* Inner decorative dots */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-purple-400 rounded-full shadow-md"></div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="w-3 h-3 bg-purple-400 rounded-full shadow-md"></div>
      </div>
      
      {/* Optional text */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-purple-300 font-medium tracking-wider">
        Loading...
      </div>
    </div>
  </div>
);

export default Loader;