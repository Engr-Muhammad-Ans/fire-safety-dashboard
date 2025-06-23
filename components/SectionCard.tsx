
import React from 'react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from './icons';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode; // Icon prop is optional and may not be provided
  children: React.ReactNode;
  className?: string;
  gridSpan?: string; 
  headerActions?: React.ReactNode;
  exportActions?: React.ReactNode;
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  icon, // This will be undefined if not passed from App.tsx
  children, 
  className = '', 
  gridSpan = '', 
  headerActions, 
  exportActions,
  isZoomed,
  onToggleZoom
}) => {

  const handleZoomToggle = () => {
    if (onToggleZoom) {
      onToggleZoom(title);
    }
  };

  const cardClasses = isZoomed 
    ? 'fixed inset-0 z-40 bg-slate-900 p-4 md:p-6 overflow-y-auto flex flex-col' 
    : `bg-slate-800 shadow-xl rounded-lg ${gridSpan} ${className} flex flex-col h-full transition-all duration-300 ease-in-out p-4 md:p-6`;
  
  const contentMaxHeight = isZoomed ? 'max-h-full' : 'max-h-[calc(100vh-200px)] md:max-h-[300px]';

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
        <div className="flex items-center">
          {/* Icon is only rendered if provided. If App.tsx doesn't pass it, it won't render. */}
          {icon && <span className="mr-2">{icon}</span>} 
          <h2 className="text-lg md:text-xl font-semibold text-slate-100">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {exportActions}
          {headerActions}
          {onToggleZoom && (
             <button
                onClick={handleZoomToggle}
                className="p-1.5 text-slate-400 hover:text-teal-400 transition-colors"
                title={isZoomed ? "Exit Full Screen" : "View Full Screen"}
                aria-label={isZoomed ? "Exit Full Screen" : "View Full Screen"}
            >
                {isZoomed ? <ArrowsPointingInIcon className="w-5 h-5" /> : <ArrowsPointingOutIcon className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
      <div 
        className={`${contentMaxHeight} overflow-y-auto visible flex-grow pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800`}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
