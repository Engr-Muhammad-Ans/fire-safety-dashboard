
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full py-8">
      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-3 text-slate-300">Loading data...</p>
    </div>
  );
};

export default LoadingSpinner;
