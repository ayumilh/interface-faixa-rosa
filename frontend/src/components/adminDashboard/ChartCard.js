// src/components/AdminDashboard/ChartCard.js
import React from "react";

const ChartCard = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        {icon}
        {title}
      </h2>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
