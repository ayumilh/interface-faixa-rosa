// src/components/common/Tooltip.js
import React from "react";

const Tooltip = ({ children, content }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <span className="absolute bottom-full mb-2 hidden group-hover:flex justify-center px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
