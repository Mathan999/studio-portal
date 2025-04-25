import React from 'react';

function StatsCard({ title, value, color }) {
  // Determine the color scheme based on the provided color prop
  const getTitleColor = () => {
    switch (color) {
      case 'blue': return 'text-blue-300';
      case 'green': return 'text-green-300';
      case 'yellow': return 'text-yellow-300';
      default: return 'text-blue-300';
    }
  };

  const getIconBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-600 bg-opacity-20';
      case 'green': return 'bg-green-600 bg-opacity-20';
      case 'yellow': return 'bg-yellow-600 bg-opacity-20';
      default: return 'bg-blue-600 bg-opacity-20';
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case 'blue': return 'border-blue-900';
      case 'green': return 'border-green-900';
      case 'yellow': return 'border-yellow-900';
      default: return 'border-blue-900';
    }
  };

  // Determine which icon to show based on the title
  const getIcon = () => {
    if (title.includes('Active')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    } else if (title.includes('Completed')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (title.includes('Pending')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`bg-gray-800 p-4 sm:p-6 rounded-lg border ${getBorderColor()} shadow-lg relative overflow-hidden`}>
      {/* Card content */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${getTitleColor()}`}>{title}</h3>
          <p className="text-3xl sm:text-4xl font-bold text-white">{value}</p>
        </div>
        
        {/* Icon */}
        <div className={`${getIconBgColor()} p-3 rounded-full ${getTitleColor()}`}>
          {getIcon()}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${getIconBgColor()} opacity-30`}></div>
    </div>
  );
}

export default StatsCard;