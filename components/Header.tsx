
import React, { useState } from 'react';
import { FireIcon, AboutIcon } from './icons'; 

const Header: React.FC = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  return (
    <>
      <header className="bg-slate-800 shadow-lg p-4 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <FireIcon className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">
              Fire Safety Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAboutModal}
              className="p-1.5 text-slate-400 hover:text-sky-400 transition-colors"
              title="About this Dashboard"
              aria-label="About this Dashboard"
            >
              <AboutIcon className="w-6 h-6" />
            </button>
            <div className="text-sm text-slate-400 hidden sm:block">
              Central Monitoring System
            </div>
          </div>
        </div>
      </header>

      {showAboutModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={toggleAboutModal} // Close modal on backdrop click
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="about-modal-title"
        >
          <div 
            className="bg-slate-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto transform transition-all duration-300 scale-100 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal content
          >
            <div className="flex justify-between items-center mb-6">
              <h3 id="about-modal-title" className="text-2xl font-semibold text-sky-400">
                About the Fire Safety Dashboard
              </h3>
              <button 
                onClick={toggleAboutModal} 
                className="text-slate-400 hover:text-slate-200 text-3xl leading-none"
                aria-label="Close About modal"
              >
                &times;
              </button>
            </div>
            <div className="text-slate-300 space-y-4 text-sm md:text-base">
              <p>
                The objective of the <strong>Fire Safety Dashboard</strong> is to create a centralized, real-time, and digitally accessible platform that enhances fire safety oversight, improves emergency response, and streamlines compliance monitoring in the <strong>Evaporation & Boiling section</strong> of Sheikhoo Sugar Mills.
              </p>
              <p>This system is designed to:</p>
              <ul className="list-disc list-outside space-y-2 pl-5 text-slate-300">
                <li>
                  <strong>Digitally monitor critical fire alarm systems</strong> including detectors, sensors, and control panels across high-risk zones.
                </li>
                <li>
                  <strong>Track fire pump performance</strong> to ensure emergency water supply readiness.
                </li>
                <li>
                  <strong>Maintain a live log of fire extinguishers</strong>, highlighting expired or due units for timely replacement or inspection.
                </li>
                <li>
                  <strong>Enable rapid emergency communication</strong> through updated emergency contacts and incident reporting tools.
                </li>
                <li>
                  <strong>Monitor fire drill performance</strong>, evacuation times, and staff preparedness through a structured drill tracker.
                </li>
                <li>
                  <strong>Evaluate fire safety KPIs</strong>, training compliance, and hazard resolution trends for continuous improvement and audit readiness.
                </li>
                <li>
                  Provide a <strong>user-friendly interface</strong> for operators, engineers, and safety staff to engage with the system proactively and make data-driven decisions.
                </li>
              </ul>
              <p>
                By digitizing fire safety operations, this dashboard enhances preventive measures, ensures faster response during emergencies, and fosters a culture of accountability and preparedness within the plant’s critical process areas.
              </p>
            </div>
            <div className="mt-8 text-right">
              <button
                onClick={toggleAboutModal}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md shadow-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;