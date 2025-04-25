import React from 'react';
import StatsCard from '../Design/StatsCard'; // Make sure the path is correct

function StatsSection({ projectStats }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <StatsCard 
            title="Active Projects" 
            value={projectStats.activeProjects} 
            color="blue" 
          />
          <StatsCard 
            title="Completed Projects" 
            value={projectStats.completedProjects} 
            color="green" 
          />
          <StatsCard 
            title="Pending Review" 
            value={projectStats.pendingReview} 
            color="yellow" 
          />
        </div>
      </div>
    </div>
  );
}

export default StatsSection;