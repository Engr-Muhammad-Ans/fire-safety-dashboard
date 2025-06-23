import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  zoomedCardTitle?: string | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, zoomedCardTitle }) => {
  if (zoomedCardTitle) {
    const zoomedChild = React.Children.toArray(children).find(child => 
      React.isValidElement(child) && (child.props as any).title === zoomedCardTitle
    );
    if (zoomedChild) {
      return (
        <div className="w-full h-full">
          {React.cloneElement(zoomedChild as React.ReactElement<any>, { 
             // Ensure the zoomed card has appropriate styling, perhaps by adding a specific class or prop
             // Forcing a re-render or specific style for zoomed state might be needed here or in SectionCard
           })}
        </div>
      );
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {children}
    </div>
  );
};

export default DashboardLayout;