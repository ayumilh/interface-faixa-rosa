// components/perfil/Tooltip.js
import { useState } from 'react';

export default function Tooltip({ message, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute top-8 left-0 w-64 bg-gray-800 text-white text-sm p-2 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
}
